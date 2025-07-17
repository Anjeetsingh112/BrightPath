const express = require("express");
const { isAuthenticated } = require("../meddlewares/isAuthenticated");
const {
  createCourse,
  getCreatorCourses,
  editCourse,
  getCourseById,
  createLecture,
  getCourseLecture,
  removeLecture,
  getLectureById,
  editLecture,
  togglePublishCourse,
  removeCourse,
  getPublishedCourse,
  searchCourse
} = require("../controllers/course.controller");
const router = express.Router();
const upload = require("../utils/multer");



router.route("/published-courses").get( getPublishedCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/:courseId").put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId").delete(isAuthenticated, removeCourse);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId/publish").patch(isAuthenticated, togglePublishCourse);
module.exports = router;
