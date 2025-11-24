const mongoose = require('mongoose');

const CallLogSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Hold', 'Recall Required', 'Non-Responsive', 'Sales Generated', 'Call Later', 'Reassigned', 'Others', 'Received', 'Not Reachable', 'Closed', 'Not Relevant', 'Scheduled'],
        default: 'Pending'
    },
    notes: {
        type: String
    },
    followUpDate: {
        type: Date
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Enhanced fields
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    statusText: {
        type: String
    },
    targetDateTime: {
        type: Date
    },
    calledDateTime: {
        type: Date
    },
    communicationMethod: {
        type: String,
        enum: ['Call', 'SMS', 'WhatsApp', 'Email', 'Facebook', 'LinkedIn'],
        default: 'Call'
    }
}, { timestamps: true });

module.exports = mongoose.model('CallLog', CallLogSchema);
