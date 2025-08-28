const mongoose = require('mongoose');
const User = require('./userSchema');

const professorSchema = new mongoose.Schema({
    myCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    coins: {
        type: Number,
        default: 0
    }
});

const Professor = User.discriminator('Professor', 
    professorSchema
);

professorSchema.statics.extractFields = (allFields) => {
    const userFields = User.extractFields(allFields);
    return {
        ...userFields
    }
}

module.exports = Professor;