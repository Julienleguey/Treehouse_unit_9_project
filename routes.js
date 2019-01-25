'use strict';

const express = require('express');
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;

// adding bcrypt to hash the passwords
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// adding basic-auth to authenticate the user
const auth = require('basic-auth');



/*************************
Middlewares
**************************/

// Defining an empty authenticateUser() middleware function in our routes module:
const authenticateUser = (req, res, next) => {

  User.findOne({ emailAddress: auth(req).name }, function(err, user) {

    // If the user is found:
    if (user) {
      const authenticated = bcrypt.compareSync(auth(req).pass, user.password);

      // If the passwords match:
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.emailAddress}`);
        req.currentUser = user;
        next();
      // If the passwords doesn't match:
      } else {
        err = new Error("Authentication failure!");
        err.status = 401;
        next(err);
      }
    // If the user is not found:
    } else {
      err = new Error("User Not Found!");
      err.status = 401;
      next(err);
    }
  });
};


// Check if the course for the provided :id route parameter value is owned by the currently authenticated user
const coursesAuthor = (req, res, next) => {
  const id = req.params.id;

  Course.findById(id).populate({ path: 'user', select: "emailAddress"}).exec(function (err, course){
          const authenticatedUser = req.currentUser.emailAddress;
          const courseAuthor = course.user.emailAddress;
          if (authenticatedUser === courseAuthor) {
            console.log("It's the correct user!");
            next();
          } else {
            err = new Error('This user is not allowed to modify this course!');
            err.status = 403;
            next(err);
          }
        });

};


/*********
Routes
*********/

//200 - Returns the currently authenticated user
router.get('/users', authenticateUser, function(req, res){
  const user = req.currentUser;
  res.json(user);
});


// 201 - Creates a user, sets the Location header to "/", and returns no content
// regex from: https://emailregex.com/
router.post('/users', function(req, res, next){
  const user = new User(req.body);
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Validate that the provided email address isn't already associated with an existing user record.
  User.findOne({ emailAddress: user.emailAddress }, function(err, userAlreadyExist) {

    if (userAlreadyExist) {
      return res.status(403).send('This email address is already used! Try to log in!');
      // Validate that the provided email address value is in fact a valid email address.
    } else if (!regex.test(user.emailAddress)) {
      return res.status(403).send('This email address is not valid!');
    } else {

      // Hashing the password of the new user
      const myPlaintextPassword = req.body.password;
      const hash = bcrypt.hashSync(myPlaintextPassword, salt);
      const url = '/';
      user.password = hash;

      user.save(function (err, user) {
        // Returns an error if the required fields are empty
        if (err) {
          err.status = 400;
          return next(err);
        } else {
          res.setHeader("Location", url);
          res.status(201).send('User created!');
        }
      });
    }
  });
});


//200 - Returns a list of courses (including the user that owns each course)
router.get('/courses', function(req, res, next){
  Course.find({})
        .populate({ path: 'user', select: ["firstName", "lastName"]})
        .exec(function(err, courses) {
          if (err) return next(err);
          res.status(200);
          res.json(courses);
        });
});


//200 - Returns a course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', function(req, res, next){
  const id = req.params.id;
  Course.findById(id)
          .populate({ path: 'user', select: ["firstName", "lastName"]})
          .exec(function(err, course) {
            if (err) return next(err);
            res.status(200);
            res.json(course);
          });
});


//201 - Creates a course, sets the Location header to the URL for the course, and returns no content
router.post('/courses', authenticateUser, function(req, res, next){
  const course = new Course(req.body);
  const url = `/courses/${course._id}`;

  // Adding the authenticated user as the user of this course
  course.user = req.currentUser._id;

  course.save(function(err, course) {
    // Returns an error if the required fields are empty
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.setHeader("Location", url);
    res.status(201).send('Course created!');
  });
});


//204 - Updates a course and returns no content
router.put('/courses/:id', authenticateUser, coursesAuthor, function(req, res, next){
  const id = req.params.id;

  Course.findById(id).updateOne(req.body, function(err, course) {
          if (err) {
            err.status = 400;
            return next(err);
          } else {
          res.status(204).send();
          }
  });
});


//204 - Deletes a course and returns no content
router.delete('/courses/:id', authenticateUser, coursesAuthor, function(req, res, next){
  const id = req.params.id;
  Course.findByIdAndDelete(id)
          .exec(function(err) {
            if (err) return next(err);
            res.status(204).send();
          });
});


/***********************************
Other useful routes while developing
***********************************/

/*
//200 - Returns all users
router.get('/users', function(req, res, next){
  User.find({})
      .exec(function(err, users) {
        if (err) return next(err);
        res.json(users);
      });
});


//204 - Deletes a user and returns no content
router.delete('/users/:id', function(req, res, next){
  const id = req.params.id;
  User.findByIdAndDelete(id)
          .exec(function(err) {
            if (err) return next(err);
            res.status(204).send('User deleted!');
          });
});

//204 - Deletes a course and returns no content (no authentication required)
router.delete('/courses/:id', function(req, res, next){
  const id = req.params.id;
  Course.findByIdAndDelete(id)
          .exec(function(err) {
            if (err) return next(err);
            res.status(204).send('Course deleted!');
          });
});
*/


module.exports = router;
