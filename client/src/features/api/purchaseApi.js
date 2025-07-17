import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "https://brightpath-bil5.onrender.com/api/v1/course-purchase/";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckout: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-razorpay-order",
        method: "POST",
        body: {courseId},
      }),
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) =>({
        url: `/course/${courseId}`,
        method: "GET",
      }), 
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),
  }),
});


export const {
useCreateCheckoutMutation,
useGetCourseDetailWithStatusQuery,
useGetPurchasedCoursesQuery
} = purchaseApi;

