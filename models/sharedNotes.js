const mongoose = require('mongoose');

const sharedNotesSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    videoName: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    reviewMessage: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SharedNotes', sharedNotesSchema);
