const Razorpay = require("razorpay");
const crypto = require("crypto");
const CoursePurchase = require("../models/purchaseCourse");
const User = require("../models/user");
const Course = require("../models/course");
const Lecture = require("../models/lecture");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
 const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.id; 
    const { courseId } = req.body;

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

  // Before creating Razorpay order:
const shortCourseId = courseId.toString().slice(-5);
const shortTimestamp = Date.now();

// Then use:
const order = await razorpay.orders.create({
  amount: Math.round(course.coursePrice * 100),
  currency: "INR",
  receipt: `rcpt_${shortCourseId}_${shortTimestamp}`,
  notes: {
    courseId: courseId.toString(),
    userId: userId.toString(),
  },
});

    // Save the purchase record with Razorpay order ID
    newPurchase.paymentId = order.id;
    await newPurchase.save();
    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Find the purchase record
      const purchase = await CoursePurchase.findOne({ paymentId: razorpay_order_id }).populate({ path: "courseId" });
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      // Update purchase status and payment ID
      purchase.status = "completed";
      purchase.paymentId = razorpay_payment_id;
      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId } },
        { new: true }
      );

      // Update course's enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

      // Make all lectures visible by setting isPreviewFree to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      return res.status(200).json({ status: "ok" });
    } else {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

// Get course details with purchase status
const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId,status: "completed" });

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }
    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { createRazorpayOrder,getCourseDetailWithPurchaseStatus,paymentVerification,getAllPurchasedCourse};
