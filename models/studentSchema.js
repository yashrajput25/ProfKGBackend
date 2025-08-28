const mongoose = require('mongoose');
const User = require('./userSchema');

const studentSchema = new mongoose.Schema({
    ongoingCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    watchedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }],
    coins: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String,
    },
    rank: {
        type: Number,
        default: 99999   // Optional: can default to a very low rank
    },
    badge: {
        type: String,
        default: "bronze",
        enum: ["bronze", "silver", "gold", "platinum", "legend"]
    }      
    
});


//The discriminator() function is the key that connects them.//
const Student = User.discriminator('Student', 
    studentSchema
);

studentSchema.statics.extractFields = (allFields) => {
    const userFields = User.extractFields(allFields);
    return {
        ...userFields,
        coins: 0,
        rank: studentCount + 1, // 👈 dynamic rank assignment
        badge: "bronze",
        ongoingCourses: [],
        watchedVideos: [],
        notes: []
    }
}

module.exports = Student;