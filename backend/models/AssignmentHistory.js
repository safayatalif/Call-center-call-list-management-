const mongoose = require('mongoose');

const AssignmentHistorySchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    previousAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    newAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reassignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reassignDate: {
        type: Date,
        default: Date.now
    },
    reason: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('AssignmentHistory', AssignmentHistorySchema);
