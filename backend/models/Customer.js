const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    // Basic contact info
    countryCode: {
        type: String,
        default: '+880'
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    // Social media links
    facebookLink: {
        type: String
    },
    linkedinLink: {
        type: String
    },
    otherLink: {
        type: String
    },
    callLinkType: {
        type: String // Comma separated: Mobile, Facebook, LinkedIn, WhatsApp
    },
    // Additional info
    textNote: {
        type: String
    },
    contactType: {
        type: String,
        enum: ['number', 'link'],
        default: 'number'
    },
    area: {
        type: String
    },
    customerFeedback: {
        type: String
    },
    agentFeedback: {
        type: String
    },
    neverCallIndicator: {
        type: Boolean,
        default: false
    },
    neverCallMessage: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Undefined'],
        default: 'Undefined'
    },
    birthdate: {
        type: Date
    },
    customerType: {
        type: String,
        enum: ['Undefined', 'New', 'Regular', 'Reorder'],
        default: 'Undefined'
    },
    callNumberLabel: {
        type: String
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
