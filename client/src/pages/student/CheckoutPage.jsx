import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent} from "@/components/ui/card";
import { useCreateCheckoutMutation, useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { purchaseApi } from "@/features/api/purchaseApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createCheckout, { isLoading: isCheckoutLoading, error: checkoutError }] =
    useCreateCheckoutMutation();
  const { data: courseData, isLoading: isCourseLoading, isError: isCourseError } =
    useGetCourseDetailWithStatusQuery(courseId);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      toast.error("Failed to load Razorpay SDK");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

 const handleCheckout = async () => {
    if (!razorpayLoaded) {
      toast.error("Razorpay SDK not loaded. Please try again.");
      return;
    }

    try {
      const response = await createCheckout(courseId).unwrap();
      const { order } = response;

      if (!order) {
        toast.error("Failed to create order. Please try again.");
        return;
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "BrightPath",
        description: `Purchase for Course: ${courseData?.course?.courseTitle || "Course"}`,
        handler: async (response) => {
          try {
            // Verify payment with backend
            await axios.post(
              "https://brightpath-bil5.onrender.com/api/v1/course-purchase/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            // Invalidate course detail cache to refresh purchased status
            dispatch(purchaseApi.util.invalidateTags([{ type: "getCourseDetailWithStatus", id: courseId }]));

            toast.success("Payment successful! You are now enrolled.");
            // Pass a flag to indicate the purchase was just completed
            navigate(`/course-progress/${courseId}`, { state: { justPurchased: true } });
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
            console.error("Verification error:", err);
          }
        },
        prefill: {
          name: courseData?.course?.creator?.name || "User",
          email: "user@example.com", // Replace with user email from auth context
        },
        notes: { courseId },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        console.error("Payment failed:", response.error);
      });
      rzp.open();
    } catch (err) {
      toast.error("Error initiating payment: " + (err.message || "Unknown error"));
      console.error("Checkout error:", err);
    }
  };

  if (isCourseLoading) return <Loader2 size={40} />;
  if (isCourseError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load course details
      </div>
    );
  if (courseData?.purchased)
    return (
      <div className="flex flex-col items-center and justify-center min-h-screen">
        You have already purchased this course!
        <div className="flex items-center gap-8">
        <Button
          onClick={() => navigate(`/course-detail/${courseId}`)}
          className="mt-4"
        >
          Go back to Course Detail
        </Button>
         <Button
          onClick={() => navigate(`/course-progress/${courseId}`)}
          className="mt-4"
        >
          Go to Course
        </Button>
        </div>
      </div>
    );

  return (
    <div className="bg-white dark:bg-[#141414] min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="mx-4 flex">
        <div className="w-full lg:w-1/2 p-2">
          <img
            src={
              courseData?.course?.courseThumbnail ||
              "https://media.licdn.com/dms/image/v2/D4D12AQGKEapRbPK2aA/article-cover_image-shrink_720_1280/0/1696923705582?e=2147483647&v=beta&t=MJvgrZAf4Ck00-e7fc0ptBYzO-1M-OOqcdo0kqwk5fA"
            }
            alt="Course Thumbnail"
            className="w-full h-80 object-cover"
          />
        </div>
        <div>
        <CardContent className="space-y-4 mt-10">
          {checkoutError && (
            <p className="text-red-500">
              Error: {checkoutError?.data?.message || "Something went wrong"}
            </p>
          )}
          <div className="space-y-2">
            <h3 className="text-3xl font-semibold">
              Course: {courseData?.course?.courseTitle || "Loading..."}
            </h3>
            <div className="flex items-center gap-6 space-y-5">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    courseData?.course?.creator?.photoUrl ||
                    "https://img.freepik.com/free-photo/front-view-modern-boy-with-sunglasses-posing_23-2148423101.jpg"
                  }
                  className="object-cover"
                  alt="Creator"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {courseData?.course?.creator?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
              </div>
            </div>
              <p className="font-xl font-semibold text-gray-800 dark:text-gray-200 m-4">
              Price: ₹{courseData?.course?.coursePrice || "N/A"}
            </p>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={isCheckoutLoading || !razorpayLoaded || isCourseLoading}
            className="w-full"
          >
            {isCheckoutLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutPage;


