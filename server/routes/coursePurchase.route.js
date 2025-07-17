const express = require("express");
const {
  createRazorpayOrder,
  getCourseDetailWithPurchaseStatus,
  paymentVerification,
  getAllPurchasedCourse,
} = require("../controllers/coursePurchase.controller");
const { isAuthenticated } = require("../meddlewares/isAuthenticated");

const router = express.Router();

router.route("/checkout/create-razorpay-order").post(isAuthenticated, createRazorpayOrder);

router.route("/course/:courseId").get(isAuthenticated, getCourseDetailWithPurchaseStatus);

router.post("/verify-payment", isAuthenticated, paymentVerification);
router.route("/").get(isAuthenticated,getAllPurchasedCourse);
module.exports = router;
