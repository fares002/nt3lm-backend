const express = require("express");
const { validationResult } = require("express-validator");
let { Course } = require("../models/coursesModel");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../midelWare/aysncWrapper");
const appError = require("../utils/appError");
const upload = require("../midelWare/multer"); // Import the multer config

const getAllcourses = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});


const getSingleCoures = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (!course) {
    const error = appError.create("course not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  return res.json({ status: httpStatusText.SUCCESS, data: { course } });
});


const addCourse = asyncWrapper(async (req, res) => {
    console.log(req.body)
    const { title, price, description, category, duration, author, videoTitle, videosDes } = req.body;

    // Get uploaded files
    const thumbnailPath = req.files["thumbnail"]
      ? req.files["thumbnail"][0].path
      : null;
    const videoPaths = req.files["videos"]
      ? req.files["videos"].map((file) => file.path)
      : [];

    // Create the course with video paths
    const newCourse = new Course({
      title: Array.isArray(title) ? title.join(', ') : title,
      price,
      description: Array.isArray(description) ? description.join(', ') : description,
      category,
      duration,
      author,
      videos: {
        title: videoTitle || "",
        description: videosDes || "",
        url:videoPaths    
      }, // Store video file paths in the database
      thumbnail: thumbnailPath, // Store the thumbnail image path
    });

    await newCourse.save();

    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });

});


const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const erorrs = validationResult(req.body);
  console.log(erorrs.array());
  if (!erorrs.isEmpty()) {
    const error = appError.create(erorrs.array(), 404, httpStatusText.FAIL);
    return next(error);
  }

  const updatedCourse = await Course.findByIdAndUpdate(courseId, {
    $set: { ...req.body },
  });
  if (!updatedCourse) {
    const error = appError.create("course not found", 404, httpStatusText.FAIL);
    return next(error);
  }

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: updatedCourse });
});


const deleteCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const deltedCourse = await Course.findByIdAndDelete(courseId);
  console.log('deleted successfully')
  if (!deltedCourse) {
    const error = appError.create("course not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  // Use filter to remove the course
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: deltedCourse });
});


const addVideosToCourse = asyncWrapper(async (req, res) => {
  try {
    const { courseId } = req.params;

    // Get uploaded video files

    const videoPaths = req.files ? req.files.map((file) => file.path) : [];
    console.log(videoPaths)

    // Get titles and descriptions from the request body
    const { videoTitles = [], videoDescriptions = [] } = req.body;

    const titlesArray = Array.isArray(videoTitles) ? videoTitles : [videoTitles];
    const descriptionsArray = Array.isArray(videoDescriptions) ? videoDescriptions : [videoDescriptions];
  

    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add new videos to the existing videos array
    videoPaths.forEach((path, index) => {
      course.videos.push({
          title: titlesArray.length === 1 ? titlesArray[0] : titlesArray[index] || '', // Use the single title if there's only one, otherwise use the current index
          description: descriptionsArray.length === 1 ? descriptionsArray[0] : descriptionsArray[index] || '', // Same logic for descriptions
          url: path,
      });
    });

    // Save the updated course
    await course.save();
  

    res.status(200).json({ message: 'Videos added successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding videos', error: error.message });
  }
});


const search = asyncWrapper(async (req, res) => {
  const { query } = req.query;

  try {
    // Find courses where the title matches the search term (case-insensitive)
    const courses = await Course.find({
      title: { $regex: query, $options: 'i' } // Case-insensitive search on title
    });

    // Return the found courses in the response
    res.status(200).json(courses);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});



module.exports = {
  getAllcourses,
  getSingleCoures,
  addCourse,
  updateCourse,
  deleteCourse,
  addVideosToCourse,
  search
};
