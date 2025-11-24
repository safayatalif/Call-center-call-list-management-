const Assignment = require('../models/Assignment');
const CallLog = require('../models/CallLog');
const User = require('../models/User');
const AssignmentHistory = require('../models/AssignmentHistory');
const ActivityLog = require('../models/ActivityLog');

// Check agent capacity before assignment
exports.checkAgentCapacity = async (req, res) => {
    const { agentId } = req.params;

    try {
        const agent = await User.findById(agentId);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        const currentAssignments = await Assignment.countDocuments({ agentId });
        const capacity = agent.capacity || 3;

        res.json({
            agentId,
            agentName: agent.name,
            currentAssignments,
            capacity,
            available: currentAssignments < capacity,
            remaining: Math.max(0, capacity - currentAssignments)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Assign customers with capacity check
exports.assignCustomers = async (req, res) => {
    const { customerIds, agentId, overrideCapacity } = req.body;

    try {
        // Check agent capacity
        const agent = await User.findById(agentId);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        const currentAssignments = await Assignment.countDocuments({ agentId });
        const capacity = agent.capacity || 3;
        const newTotal = currentAssignments + customerIds.length;

        if (newTotal > capacity && !overrideCapacity) {
            return res.status(400).json({
                message: 'Agent capacity exceeded',
                currentAssignments,
                capacity,
                requested: customerIds.length,
                overCapacity: newTotal - capacity
            });
        }

        const assignments = customerIds.map(customerId => ({
            customerId,
            agentId,
            assignedBy: req.user.id
        }));

        const createdAssignments = await Assignment.insertMany(assignments);

        // Create initial call logs for assignments
        const callLogs = createdAssignments.map(assignment => ({
            assignmentId: assignment._id,
            status: 'Pending',
            updatedBy: req.user.id
        }));

        await CallLog.insertMany(callLogs);

        // Log activity
        await ActivityLog.create({
            action: 'Customers Assigned',
            performedBy: req.user.id,
            targetType: 'Assignment',
            targetId: createdAssignments[0]._id,
            details: `Assigned ${customerIds.length} customers to ${agent.name}`
        });

        res.json({
            message: 'Customers assigned successfully',
            count: createdAssignments.length,
            capacityWarning: newTotal > capacity
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Reassign customers with history tracking
exports.reassignCustomers = async (req, res) => {
    const { assignmentIds, newAgentId, reason } = req.body;

    try {
        const newAgent = await User.findById(newAgentId);
        if (!newAgent) {
            return res.status(404).json({ message: 'New agent not found' });
        }

        // Check capacity
        const currentAssignments = await Assignment.countDocuments({ agentId: newAgentId });
        const capacity = newAgent.capacity || 3;
        const newTotal = currentAssignments + assignmentIds.length;

        if (newTotal > capacity) {
            return res.status(400).json({
                message: 'New agent capacity exceeded',
                currentAssignments,
                capacity,
                requested: assignmentIds.length
            });
        }

        const historyRecords = [];
        const updatedAssignments = [];

        for (const assignmentId of assignmentIds) {
            const assignment = await Assignment.findById(assignmentId);
            if (!assignment) continue;

            const previousAgentId = assignment.agentId;

            // Create history record
            historyRecords.push({
                assignmentId: assignment._id,
                customerId: assignment.customerId,
                previousAgent: previousAgentId,
                newAgent: newAgentId,
                reassignedBy: req.user.id,
                reason
            });

            // Update assignment
            assignment.agentId = newAgentId;
            await assignment.save();
            updatedAssignments.push(assignment);
        }

        // Save history
        await AssignmentHistory.insertMany(historyRecords);

        // Log activity
        await ActivityLog.create({
            action: 'Customers Reassigned',
            performedBy: req.user.id,
            targetType: 'Assignment',
            targetId: updatedAssignments[0]?._id,
            details: `Reassigned ${assignmentIds.length} customers to ${newAgent.name}. Reason: ${reason || 'Not specified'}`
        });

        res.json({
            message: 'Customers reassigned successfully',
            count: updatedAssignments.length
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Bulk update assignments
exports.bulkUpdateAssignments = async (req, res) => {
    const { assignmentIds, updates } = req.body;

    try {
        const result = await Assignment.updateMany(
            { _id: { $in: assignmentIds } },
            { $set: updates }
        );

        // Log activity
        await ActivityLog.create({
            action: 'Bulk Update Assignments',
            performedBy: req.user.id,
            targetType: 'Assignment',
            targetId: assignmentIds[0],
            details: `Bulk updated ${assignmentIds.length} assignments`
        });

        res.json({
            message: 'Assignments updated successfully',
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get assignment history
exports.getAssignmentHistory = async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const history = await AssignmentHistory.find({ assignmentId })
            .populate('previousAgent', 'name email')
            .populate('newAgent', 'name email')
            .populate('reassignedBy', 'name')
            .sort({ reassignDate: -1 });

        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAgentCustomers = async (req, res) => {
    try {
        const assignments = await Assignment.find({ agentId: req.params.id }).populate('customerId');
        res.json(assignments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

