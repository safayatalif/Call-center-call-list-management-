const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'MANAGER', 'AGENT', 'TRAINEE'],
        default: 'AGENT'
    },
    status: {
        type: String,
        enum: ['Active', 'Closed', 'Undefined'],
        default: 'Active'
    },
    // Enhanced profile fields
    personalMobile: {
        type: String
    },
    alternateMobile: {
        type: String
    },
    officialMobile: {
        type: String
    },
    socialMediaIds: {
        type: Map,
        of: String,
        default: {}
    },
    address: {
        type: String
    },
    remarks: {
        type: String
    },
    capacity: {
        type: Number,
        min: 0,
        max: 5,
        default: 3
    },
    restrictedDataPrivilege: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
