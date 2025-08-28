const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String
    },
    discordId: {
        type: String
    },
    verified: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

const User = mongoose.model('User', userSchema);

userSchema.statics.extractFields = (allFields) => {
    let {fullName, email, phoneNumber, discordId, verified = false} = allFields;
    if(!fullName || !email) {
        throw new Error('Full name and email are required');
    }
    fullName = fullName.trim();
    email = email.trim();
    phoneNumber = phoneNumber?.trim();
    discordId = discordId?.trim();
    return {
        fullName, 
        email,
        phoneNumber,
        discordId,
        verified
    }
}

userSchema.statics.findOrCreate = async (profile, next) => {
    try {
        const {
            name: fullName,
            email
        } = profile._json;
        const user = await User.findOne({ email });
        if(user) {
            return next(null, user);
        } else {
            const newUser = new User({
                fullName,
                email
            });
            await newUser.save();
            return next(null, newUser);
        }
    } catch(err) {
        console.log(err);
        return next(err);
    }
}

userSchema.statics.validateFields = (user) => {
    const { fullName, email, phoneNumber } = user;
    if(!fullName || fullName.trim().length === 0) { 
        throw new Error('Full name is not valid');
    }
    validateEmail(email);
    validatePhoneNumber(phoneNumber);
    return true;
}

module.exports = User;