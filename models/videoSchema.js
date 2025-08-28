const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    duration: {
        type: String
    },
    lectureNumber: {
        type: Number,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    relatedVideos: [{
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        },
        weight: {
            type: Number
        }
    }],
    videoNumber: {
        type: Number,
        trim: true
    },
    url: {
        type: String,
        trim: true
    },

    startTime: {
    type: Number, 
    // required: true
    },
    
    endTime: {
    type: Number,
    // required: true
    }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;