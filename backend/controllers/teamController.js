const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const ActivityLog = require('../models/ActivityLog');

// Create Team
exports.createTeam = async (req, res) => {
    const { teamName, description, teamFor, teamLead } = req.body;
    try {
        const team = new Team({
            teamName,
            description,
            teamFor,
            teamLead,
            createdBy: req.user.id
        });
        await team.save();

        // Log activity
        await ActivityLog.create({
            action: 'Team Created',
            performedBy: req.user.id,
            targetType: 'Team',
            targetId: team._id,
            details: `Created team: ${teamName}`
        });

        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get All Teams
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('teamLead', 'name email')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
        res.json(teams);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get Team by ID with members
exports.getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('teamLead', 'name email')
            .populate('createdBy', 'name');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Get team members
        const members = await TeamMember.find({ teamId: req.params.id, status: 'active' })
            .populate('userId', 'name email role capacity');

        res.json({ team, members });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update Team
exports.updateTeam = async (req, res) => {
    const { teamName, description, teamFor, teamLead, status } = req.body;
    try {
        let team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        if (teamName) team.teamName = teamName;
        if (description) team.description = description;
        if (teamFor) team.teamFor = teamFor;
        if (teamLead) team.teamLead = teamLead;
        if (status) team.status = status;

        await team.save();

        // Log activity
        await ActivityLog.create({
            action: 'Team Updated',
            performedBy: req.user.id,
            targetType: 'Team',
            targetId: team._id,
            details: `Updated team: ${teamName}`
        });

        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete Team
exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        await team.deleteOne();

        // Log activity
        await ActivityLog.create({
            action: 'Team Deleted',
            performedBy: req.user.id,
            targetType: 'Team',
            targetId: team._id,
            details: `Deleted team: ${team.teamName}`
        });

        res.json({ message: 'Team removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Add Team Member
exports.addTeamMember = async (req, res) => {
    const { userId } = req.body;
    const { teamId } = req.params;

    try {
        // Check if already a member
        const existing = await TeamMember.findOne({ teamId, userId });
        if (existing) {
            return res.status(400).json({ message: 'User is already a team member' });
        }

        const teamMember = new TeamMember({
            teamId,
            userId,
            assignedBy: req.user.id
        });
        await teamMember.save();

        // Log activity
        await ActivityLog.create({
            action: 'Team Member Added',
            performedBy: req.user.id,
            targetType: 'Team',
            targetId: teamId,
            details: `Added member to team`
        });

        const populated = await TeamMember.findById(teamMember._id)
            .populate('userId', 'name email role capacity');

        res.json(populated);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Remove Team Member
exports.removeTeamMember = async (req, res) => {
    const { teamId, memberId } = req.params;

    try {
        const teamMember = await TeamMember.findOne({ teamId, userId: memberId });
        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        teamMember.status = 'inactive';
        await teamMember.save();

        // Log activity
        await ActivityLog.create({
            action: 'Team Member Removed',
            performedBy: req.user.id,
            targetType: 'Team',
            targetId: teamId,
            details: `Removed member from team`
        });

        res.json({ message: 'Team member removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get Team Members
exports.getTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find({ teamId: req.params.teamId, status: 'active' })
            .populate('userId', 'name email role capacity personalMobile officialMobile')
            .populate('assignedBy', 'name');
        res.json(members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
