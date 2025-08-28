const mongoose = require('mongoose');

// Course Schema
const courseSchema = new mongoose.Schema({
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    
    //TODO : change reference to Professor
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'Student'
    },
    status: {
        type: String,
        enum: ['upcoming', 'live'],
    }, 
    numEnrolledStudents: {
        type: Number,
        default: 0
    }
});

courseSchema.statics.extractFields = (allFields) => {
    let {title, description, status = 'upcoming'} = allFields;
    if(!title) {
        throw {
            success: false,
            message: 'Title is required'
        };
    }
    title = title.trim();
    description = description?.trim();
    return {
        title,
        description,
        status
    }
}

courseSchema.statics.validateFields = (course) => {
    const {title, status} = course;
    if(!title) {
        throw {
            success: false,
            message: 'Title is required'
        };
    }
    if(!status || (status !== 'upcoming' && status !== 'live')) {
        throw new {
            success: false,
            message: 'Status is not valid'
        };
    }
}

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;