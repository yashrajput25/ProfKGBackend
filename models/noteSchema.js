
// //kartik

// // Importing Modules
// const mongoose = require('mongoose');

// // Note Schema
// const noteSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         trim: true
//     },
//     content: {
//         type: String,
//         trim: true
//     },
//     video: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Video'
//     },
//     createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     status: {
//         type: String,
//         enum: ['public', 'private'],
//     }
// });
// const Note = mongoose.model('Note', noteSchema);

// module.exports = Note;

const mongoose = require('mongoose');

// Note Schema
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'under_review', 'approved', 'rejected', 'private'],
        default: 'pending'
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'private'
    },
    // For shared notes workflow
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Professor who reviewed
    },
    reviewMessage: {
        type: String,
        trim: true,
        maxlength: 500
    },
    reviewedAt: {
        type: Date
    },
    // Timestamps for tracking
    submittedAt: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    // Additional metadata
    tags: [{
        type: String,
        trim: true
    }],
    isShared: {
        type: Boolean,
        default: false
    },
    // For tracking versions/edits
    version: {
        type: Number,
        default: 1
    },
    originalNote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note' // Reference to original if this is an edited version
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for better query performance
noteSchema.index({ video: 1, createdBy: 1 });
noteSchema.index({ course: 1, status: 1 });
noteSchema.index({ status: 1, submittedAt: -1 });
noteSchema.index({ createdBy: 1, visibility: 1 });

// Virtual for getting formatted submission date
noteSchema.virtual('formattedSubmissionDate').get(function() {
    return this.submittedAt.toLocaleDateString();
});

// Pre-save middleware to update lastModified
noteSchema.pre('save', function(next) {
    this.lastModified = new Date();
    next();
});

// Static method to find notes by status
noteSchema.statics.findByStatus = function(status) {
    return this.find({ status: status });
};

// Instance method to approve note
noteSchema.methods.approve = function(reviewerId, message) {
    this.status = 'approved';
    this.visibility = 'public';
    this.isShared = true;
    this.reviewedBy = reviewerId;
    this.reviewMessage = message;
    this.reviewedAt = new Date();
    return this.save();
};

// Instance method to reject note
noteSchema.methods.reject = function(reviewerId, message) {
    this.status = 'rejected';
    this.reviewedBy = reviewerId;
    this.reviewMessage = message;
    this.reviewedAt = new Date();
    return this.save();
};

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
