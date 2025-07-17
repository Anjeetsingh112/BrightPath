import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

const EditCourse = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>
        <Link to="lecture">
          <a className="hover:text-blue-600 no-underline" variant="link">Go to lectures page</a>
        </Link>
      </div>
      <CourseTab/>
    </div>
  );
};

export default EditCourse;