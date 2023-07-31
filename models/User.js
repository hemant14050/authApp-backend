const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true //remove whitespace
    },
    email: {
        type: String,
        required: true,
        trim: true, //remove whitespace
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Student', 'Visitor']
    }
});

module.exports = mongoose.model("User", userSchema);