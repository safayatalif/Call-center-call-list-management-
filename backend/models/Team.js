const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    teamFor: {
        type: String,
        enum: ['Page Moderator', 'Re-Order', 'Corporate', 'Company Wise', 'Any'],
        default: 'Any'
    },
    teamLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
