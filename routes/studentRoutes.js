const express = require("express");
const router = express.Router();
const Student = require("../models/studentSchema");

router.get("/", async(req, res) => {
    try{
        const students = await Student.find({}, "fullName");
        res.json(students)

    }catch(error){
        console.error(error);
        res.status(500).json({error: "Failed to fecth student data"});
    }
});

module.exports = router;