const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Enhanced fields
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED', 'HOLD', 'PENDING'],
        default: 'OPEN'
    },
    defaultTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    restrictedFlag: {
        type: Boolean,
        default: false
    },
    companyName: {
        type: String
    },
    contactPerson: {
        type: String
    },
    contactNumber: {
        type: String
    },
    callTemplate: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
