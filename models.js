'use strict';

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// User model
const UserSchema = new Schema ({
  firstName: {type: String, required: [true, "The first name is required!"]},
  lastName: {type: String, required: [true, "The last name is required!"]},
  emailAddress: {type: String, required: [true, "An email address is required!"]},
  password: {type: String, required: [true, "A password is required!"]}
});

// Course model
const CourseSchema = new Schema ({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, required: [true, "The title of the course is required!"]},
  description: {type: String, required: [true, "A description of the course is required!"]},
  estimatedTime: String,
  materialsNeeded: String
});



// defining the models
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);


module.exports.User = User;
module.exports.Course = Course;
