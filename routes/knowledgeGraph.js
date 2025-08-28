    // const express = require("express");
    // const router = express.Router();
    // const User = require('../models/userSchema');
    // const Student = require("../models/studentSchema");
    // const Course = require('../models/courseSchema');
    // const Video = require("../models/videoSchema");

    // router.get("/:studentId", async (req, res) => {
    // try {
    //     const student = await User.findById(req.params.studentId)
    //     .select("fullName badge rank coins ongoingCourses watchedVideos")
    //     .populate({
    //         path: "ongoingCourses",
    //         select: "title videos",
    //         populate: {
    //         path: "videos",
    //         select: "title lectureNumber duration"
    //         }
    //     });

    //     if (!student) return res.status(404).json({ message: "Student not found" });

    //     const watchedSet = new Set(student.watchedVideos.map(v => v.toString()));

    //     const formattedCourses = student.ongoingCourses.map(course => {
    //     const lectureMap = {};

    //     course.videos.forEach(video => {
    //         const lectureNum = video.lectureNumber || 0;
    //         if (!lectureMap[lectureNum]) {
    //         lectureMap[lectureNum] = [];
    //         }
    //         lectureMap[lectureNum].push({
    //         _id: video._id,
    //         title: video.title,
    //         duration: video.duration,
    //         watched: watchedSet.has(video._id.toString())
    //         });
    //     });

    //     const lectures = Object.entries(lectureMap).map(([lectureNumber, videos]) => ({
    //         lectureNumber: Number(lectureNumber),
    //         videos
    //     }));

    //     return {
    //         _id: course._id,
    //         title: course.title,
    //         lectures
    //     };
    //     });

    //     res.json({
    //     fullName: student.fullName,
    //     badge: student.badge,
    //     rank: student.rank,
    //     coins: student.coins,
    //     ongoingCourses: formattedCourses
    //     });

    // } catch (error) {
    //     console.error("❌ Error in knowledge graph route:", error);
    //     res.status(500).json({ message: "Server error" });
    // }
    // });

    // module.exports = router;

    const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const Student = require("../models/studentSchema");
const Course = require("../models/courseSchema");
const Video = require("../models/videoSchema");

// GET /api/knowledgeGraph/:studentId
router.get("/:studentId", async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId)
      .select("fullName badge rank coins ongoingCourses watchedVideos")
      .populate({
        path: "ongoingCourses",
        select: "title videos",
        populate: {
          path: "videos",
          select: "title lectureNumber duration"
        }
      });

    if (!student) return res.status(404).json({ message: "Student not found" });

    const watchedSet = new Set(student.watchedVideos.map(v => v.toString()));

    // Group videos by lectureNumber
    const formattedCourses = student.ongoingCourses.map(course => {
      const lectureMap = {};

      course.videos.forEach(video => {
        const lectureNum = video.lectureNumber || 0;
        if (!lectureMap[lectureNum]) {
          lectureMap[lectureNum] = [];
        }
        lectureMap[lectureNum].push({
          _id: video._id,
          title: video.title,
          duration: video.duration,
          watched: watchedSet.has(video._id.toString())
        });
      });

      const lectures = Object.entries(lectureMap).map(([lectureNumber, videos]) => ({
        lectureNumber: Number(lectureNumber),
        videos
      }));

      return {
        _id: course._id,
        title: course.title,
        lectures
      };
    });

    res.json({
      fullName: student.fullName,
      badge: student.badge,
      rank: student.rank,
      coins: student.coins,
      ongoingCourses: formattedCourses
    });

  } catch (error) {
    console.error("❌ Error in knowledge graph route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
