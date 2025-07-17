import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({course}) => {
  return (
    <Link to={`/course-detail/${course._id}`}>
    <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src={course.courseThumbnail ||"https://media.licdn.com/dms/image/v2/D4D12AQGKEapRbPK2aA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1696923705582?e=2147483647&v=beta&t=MJvgrZAf4Ck00-e7fc0ptBYzO-1M-OOqcdo0kqwk5fA}"}
          alt="Course"
          className="w-full h-36 object-cover rounded-t-lg"
        />
        <CardContent className="px-5 py-4 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate">
         { course.courseTitle}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={course?.creator?.photoUrl||"https://img.freepik.com/free-photo/front-view-modern-boy-with-sunglasses-posing_23-2148423101.jpg"} className="object-cover" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-medium text-sm">{course?.creator?.name}</h1>
          </div>
          <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full'}>
           {course.courseLevel||"Beginner"}
          </Badge>
        </div>
        <div className="text-lg font-bold">
            <span>₹{course.coursePrice||999}</span>
        </div>
      </CardContent>
      </div>
    </Card>
    </Link>
  );
};

export default Course;
