import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null); // Use null for file input
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    { data: updateUserData, isLoading: updateIsLoading, isError, error, isSuccess },
  ] = useUpdateUserMutation();

  // Prefill name when user data is available
  useEffect(() => {
    if (data) {
      const user = data.user || data.data?.user || data.data;
      setName(user?.name || "");
    }
  }, [data]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.");
        return;
      }
      setProfilePhoto(file);
    }
  };

  const updateUserHandler = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }
      // Log FormData for debugging
      for (let [key, value] of formData.entries()) {
      }
      await updateUser(formData);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("An error occurred while updating the profile.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      setProfilePhoto(null); // Reset file input
      toast.success(updateUserData?.message || "Profile updated");
    }
  }, [isSuccess, updateUserData, refetch]);

  useEffect(() => {
    if (isError) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || error?.message || "Failed to update profile");
    }
  }, [isError, error]);

  if (isLoading) return <ProfileSkeleton />;

  const user = data && (data.user || data.data?.user || data.data);

  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-3xl text-center md:text-left mb-8 text-gray-800 dark:text-gray-200">
        PROFILE
      </h1>
      <div className="flex flex-col items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-center">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 mb-6 border-4 border-gray-200 dark:border-gray-700">
            <AvatarImage
              src={
                user?.photoUrl ||
                "https://img.freepik.com/free-photo/front-view-modern-boy-with-sunglasses-posing_23-2148423101.jpg"
              }
              className="object-cover"
              alt="profile picture"
            />
            <AvatarFallback className="text-2xl font-semibold">
              CN
            </AvatarFallback>
          </Avatar>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Name"
                    className="col-span-3"
                    aria-label="Name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="photo" className="text-right">
                    Profile Photo
                  </Label>
                  <div className="col-span-3">
                    {user?.photoUrl && (
                      <img
                        src={user.photoUrl}
                        alt="Current profile photo"
                        className="h-16 w-16 object-cover rounded-full mb-2"
                      />
                    )}
                    <Input
                      id="photo"
                      onChange={onChangeHandler}
                      type="file"
                      accept="image/*"
                      className="col-span-3"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={updateIsLoading}
                  onClick={updateUserHandler}
                >
                  {updateIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex-1 w-full">
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.name}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.role.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h1 className="font-medium text-lg text-gray-800 dark:text-gray-200">
          Courses you're enrolled in
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user.enrolledCourses.length === 0 ? (
            <h1 className="text-gray-600 dark:text-gray-400">
              You haven't enrolled in any courses yet.
            </h1>
          ) : (
            user.enrolledCourses.map((course) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <Skeleton className="h-8 w-48 mx-auto md:mx-0 mb-8" />
      <div className="flex flex-col items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex flex-col items-center">
          <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full mb-6" />
          <Skeleton className="h-9 w-24 mt-2" />
        </div>
        <div className="flex-1 w-full">
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};