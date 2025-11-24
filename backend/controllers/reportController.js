const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const Assignment = require('../models/Assignment');
const CallLog = require('../models/CallLog');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

// Get team summary with performance metrics
exports.getTeamSummary = async (req, res) => {
    try {
        const teams = await Team.find({ status: 'active' })
            .populate('teamLead', 'name email');

        const teamSummaries = await Promise.all(teams.map(async (team) => {
            // Get team members
            const members = await TeamMember.find({ teamId: team._id, status: 'active' })
                .populate('userId', 'name');

            const memberIds = members.map(m => m.userId._id);

            // Get assignments for team members
            const assignments = await Assignment.find({ agentId: { $in: memberIds } });
            const assignmentIds = assignments.map(a => a._id);

            // Get call logs
            const callLogs = await CallLog.find({ assignmentId: { $in: assignmentIds } });

            // Calculate metrics
            const totalCalls = callLogs.length;
            const pendingCalls = callLogs.filter(log => log.status === 'Pending').length;
            const completedCalls = callLogs.filter(log =>
                ['Sales Generated', 'Closed', 'Not Relevant'].includes(log.status)
            ).length;
            const salesGenerated = callLogs.filter(log => log.status === 'Sales Generated').length;

            return {
                teamId: team._id,
                teamName: team.teamName,
                teamLead: team.teamLead?.name || 'Not assigned',
                memberCount: members.length,
                totalAssignments: assignments.length,
                totalCalls,
                pendingCalls,
                completedCalls,
                salesGenerated,
                successRate: totalCalls > 0 ? ((salesGenerated / totalCalls) * 100).toFixed(2) : 0
            };
        }));

        res.json(teamSummaries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get agent performance report
exports.getAgentPerformance = async (req, res) => {
    const { agentId, startDate, endDate } = req.query;

    try {
        let query = {};
        if (agentId) {
            query.agentId = agentId;
        }

        const assignments = await Assignment.find(query)
            .populate('agentId', 'name email role')
            .populate('customerId', 'name phone');

        const assignmentIds = assignments.map(a => a._id);

        // Build call log query with date filter
        let callLogQuery = { assignmentId: { $in: assignmentIds } };
        if (startDate || endDate) {
            callLogQuery.createdAt = {};
            if (startDate) callLogQuery.createdAt.$gte = new Date(startDate);
            if (endDate) callLogQuery.createdAt.$lte = new Date(endDate);
        }

        const callLogs = await CallLog.find(callLogQuery);

        // Group by agent
        const agentMap = new Map();

        assignments.forEach(assignment => {
            const agentId = assignment.agentId._id.toString();
            if (!agentMap.has(agentId)) {
                agentMap.set(agentId, {
                    agentId,
                    agentName: assignment.agentId.name,
                    agentEmail: assignment.agentId.email,
                    role: assignment.agentId.role,
                    totalAssignments: 0,
                    callsMade: 0,
                    pending: 0,
                    salesGenerated: 0,
                    completed: 0,
                    callsByStatus: {}
                });
            }

            const agentData = agentMap.get(agentId);
            agentData.totalAssignments++;

            // Count calls for this assignment
            const assignmentCalls = callLogs.filter(log =>
                log.assignmentId.toString() === assignment._id.toString()
            );

            assignmentCalls.forEach(call => {
                agentData.callsMade++;
                agentData.callsByStatus[call.status] = (agentData.callsByStatus[call.status] || 0) + 1;

                if (call.status === 'Pending') agentData.pending++;
                if (call.status === 'Sales Generated') agentData.salesGenerated++;
                if (['Sales Generated', 'Closed', 'Not Relevant'].includes(call.status)) {
                    agentData.completed++;
                }
            });
        });

        const performanceData = Array.from(agentMap.values()).map(agent => ({
            ...agent,
            successRate: agent.callsMade > 0 ?
                ((agent.salesGenerated / agent.callsMade) * 100).toFixed(2) : 0,
            completionRate: agent.callsMade > 0 ?
                ((agent.completed / agent.callsMade) * 100).toFixed(2) : 0
        }));

        res.json(performanceData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get call statistics
exports.getCallStatistics = async (req, res) => {
    const { projectId, teamId, startDate, endDate } = req.query;

    try {
        let assignmentQuery = {};

        if (teamId) {
            const members = await TeamMember.find({ teamId, status: 'active' });
            const memberIds = members.map(m => m.userId);
            assignmentQuery.agentId = { $in: memberIds };
        }

        const assignments = await Assignment.find(assignmentQuery);
        const assignmentIds = assignments.map(a => a._id);

        let callLogQuery = { assignmentId: { $in: assignmentIds } };
        if (startDate || endDate) {
            callLogQuery.createdAt = {};
            if (startDate) callLogQuery.createdAt.$gte = new Date(startDate);
            if (endDate) callLogQuery.createdAt.$lte = new Date(endDate);
        }

        const callLogs = await CallLog.find(callLogQuery);

        // Calculate statistics
        const statusCounts = {};
        const priorityCounts = { Low: 0, Medium: 0, High: 0 };
        const methodCounts = {};

        callLogs.forEach(log => {
            // Count by status
            statusCounts[log.status] = (statusCounts[log.status] || 0) + 1;

            // Count by priority
            if (log.priority) {
                priorityCounts[log.priority]++;
            }

            // Count by communication method
            if (log.communicationMethod) {
                methodCounts[log.communicationMethod] = (methodCounts[log.communicationMethod] || 0) + 1;
            }
        });

        res.json({
            totalCalls: callLogs.length,
            totalAssignments: assignments.length,
            statusBreakdown: statusCounts,
            priorityBreakdown: priorityCounts,
            methodBreakdown: methodCounts,
            averageCallsPerAssignment: assignments.length > 0 ?
                (callLogs.length / assignments.length).toFixed(2) : 0
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get activity logs with filtering
exports.getActivityLogs = async (req, res) => {
    const { userId, targetType, action, startDate, endDate, page = 1, limit = 50 } = req.query;

    try {
        let query = {};

        if (userId) query.performedBy = userId;
        if (targetType) query.targetType = targetType;
        if (action) query.action = { $regex: action, $options: 'i' };

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [logs, total] = await Promise.all([
            ActivityLog.find(query)
                .populate('performedBy', 'name email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            ActivityLog.countDocuments(query)
        ]);

        res.json({
            logs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalLogs: total,
                limit: parseInt(limit)
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get dashboard summary
exports.getDashboardSummary = async (req, res) => {
    try {
        const [
            totalUsers,
            totalTeams,
            totalAssignments,
            totalCallLogs,
            recentActivities
        ] = await Promise.all([
            User.countDocuments({ status: 'Active' }),
            Team.countDocuments({ status: 'active' }),
            Assignment.countDocuments(),
            CallLog.countDocuments(),
            ActivityLog.find()
                .populate('performedBy', 'name')
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        // Get status breakdown
        const callLogs = await CallLog.find();
        const statusBreakdown = {};
        callLogs.forEach(log => {
            statusBreakdown[log.status] = (statusBreakdown[log.status] || 0) + 1;
        });

        res.json({
            totalUsers,
            totalTeams,
            totalAssignments,
            totalCallLogs,
            statusBreakdown,
            recentActivities
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
