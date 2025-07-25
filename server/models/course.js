const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true
    },
    subTitle:{
        type: String,
    },
    description: {
        type: String,
    },
    category:{
        type: String,
        required: true
    },
    courseLevel: {
        type: String,
        enum: ['Beginner', 'Medium', 'Advance'],
    },

    coursePrice: {
        type: Number,
    },
   
    courseThumbnail: {
        type: String,
        default: ""
    }, 
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    lectures: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lecture'
        }
    ],
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;

