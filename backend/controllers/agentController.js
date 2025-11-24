const Assignment = require('../models/Assignment');
const CallLog = require('../models/CallLog');
const ActivityLog = require('../models/ActivityLog');

// Get my calls with optional filtering
exports.getMyCalls = async (req, res) => {
    try {
        const assignments = await Assignment.find({ agentId: req.user.id })
            .populate('customerId')
            .populate('assignedBy', 'name');

        // Fetch latest call status for each assignment
        const callsWithStatus = await Promise.all(assignments.map(async (assignment) => {
            const callLog = await CallLog.findOne({ assignmentId: assignment._id }).sort({ createdAt: -1 });
            return {
                ...assignment.toObject(),
                callStatus: callLog
            };
        }));

        res.json(callsWithStatus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get filtered calls with advanced filtering
exports.getFilteredCalls = async (req, res) => {
    const { status, priority, startDate, endDate, customerType, search } = req.query;

    try {
        const assignments = await Assignment.find({ agentId: req.user.id })
            .populate('customerId')
            .populate('assignedBy', 'name');

        const assignmentIds = assignments.map(a => a._id);

        // Build call log query
        let callLogQuery = { assignmentId: { $in: assignmentIds } };

        if (status) callLogQuery.status = status;
        if (priority) callLogQuery.priority = priority;

        if (startDate || endDate) {
            callLogQuery.createdAt = {};
            if (startDate) callLogQuery.createdAt.$gte = new Date(startDate);
            if (endDate) callLogQuery.createdAt.$lte = new Date(endDate);
        }

        const callLogs = await CallLog.find(callLogQuery);

        // Match assignments with their latest call logs
        let filteredCalls = assignments.map(assignment => {
            const logs = callLogs.filter(log =>
                log.assignmentId.toString() === assignment._id.toString()
            );
            const latestLog = logs.sort((a, b) => b.createdAt - a.createdAt)[0];

            return {
                ...assignment.toObject(),
                callStatus: latestLog
            };
        });

        // Filter by customer type if specified
        if (customerType) {
            filteredCalls = filteredCalls.filter(call =>
                call.customerId?.customerType === customerType
            );
        }

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            filteredCalls = filteredCalls.filter(call =>
                call.customerId?.name?.toLowerCase().includes(searchLower) ||
                call.customerId?.phone?.toLowerCase().includes(searchLower) ||
                call.customerId?.email?.toLowerCase().includes(searchLower)
            );
        }

        res.json(filteredCalls);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update call status with enhanced fields
exports.updateCallStatus = async (req, res) => {
    const { status, notes, followUpDate, priority, communicationMethod, statusText } = req.body;
    const { id } = req.params; // Assignment ID

    try {
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.agentId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this call' });
        }

        const callLog = new CallLog({
            assignmentId: id,
            status,
            notes,
            followUpDate,
            priority: priority || 'Medium',
            statusText,
            communicationMethod: communicationMethod || 'Call',
            calledDateTime: new Date(),
            updatedBy: req.user.id
        });

        await callLog.save();

        // Log activity
        await ActivityLog.create({
            action: 'Call Status Updated',
            performedBy: req.user.id,
            targetType: 'Assignment',
            targetId: id,
            details: `Updated call status to ${status} via ${communicationMethod || 'Call'}`
        });

        res.json(callLog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Schedule next contact
exports.scheduleNextContact = async (req, res) => {
    const { targetDateTime, notes, priority } = req.body;
    const { id } = req.params; // Assignment ID

    try {
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.agentId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to schedule this call' });
        }

        const callLog = new CallLog({
            assignmentId: id,
            status: 'Scheduled',
            notes: notes || 'Scheduled for callback',
            targetDateTime: new Date(targetDateTime),
            priority: priority || 'Medium',
            updatedBy: req.user.id
        });

        await callLog.save();

        // Log activity
        await ActivityLog.create({
            action: 'Call Scheduled',
            performedBy: req.user.id,
            targetType: 'Assignment',
            targetId: id,
            details: `Scheduled call for ${new Date(targetDateTime).toLocaleString()}`
        });

        res.json(callLog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get call history for an assignment
exports.getCallHistory = async (req, res) => {
    const { id } = req.params; // Assignment ID

    try {
        const assignment = await Assignment.findById(id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.agentId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this history' });
        }

        const history = await CallLog.find({ assignmentId: id })
            .populate('updatedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

