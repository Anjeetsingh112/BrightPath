// PurchaseCourseProtectedRoute.jsx
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { useParams, Navigate, useLocation } from "react-router-dom";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const { state } = useLocation(); // Get the route state
  const { data, isLoading } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <p>Loading...</p>;

  // Allow access if the course is purchased or if justPurchased is true
  if (data?.purchased || state?.justPurchased) {
    return children;
  }

  return <Navigate to={`/course-detail/${courseId}`} />;
};

export default PurchaseCourseProtectedRoute;