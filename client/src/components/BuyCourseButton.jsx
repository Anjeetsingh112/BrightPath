// import React from "react";
// import { Button } from "./ui/button";
// import { useCreateCheckoutMutation } from "@/features/api/purchaseApi";
// import { Loader2 } from "lucide-react";

// const BuyCourseButton = ({ courseId }) => {
//   const [createCheckout, {data, isLoading }] = useCreateCheckoutMutation();

//   const purchaseCourseHandler = async () => {
//     await createCheckout(courseId);
//   };
//   return (
//     <Button
//       disabled={isLoading}
//       className="w-full"
//       onClick={purchaseCourseHandler}
//     >
//       {isLoading ? (
//         <>
//           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           Please wait
//         </>
//       ) : (
//         "Purchase Course"
//       )}
//     </Button>
//   );
// };

// export default BuyCourseButton;


import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BuyCourseButton = ({ courseId }) => {
  const navigate = useNavigate();

  const purchaseCourseHandler = () => {
    navigate(`/checkout/${courseId}`);
  };

  return (
    <Button onClick={purchaseCourseHandler} className="w-full">
      Purchase Course
    </Button>
  );
};

export default BuyCourseButton;