const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all team routes - only ADMIN and MANAGER can manage teams
router.use(authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']));

// Team CRUD
router.post('/', teamController.createTeam);
router.get('/', teamController.getTeams);
router.get('/:id', teamController.getTeamById);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

// Team Member Management
router.post('/:teamId/members', teamController.addTeamMember);
router.get('/:teamId/members', teamController.getTeamMembers);
router.delete('/:teamId/members/:memberId', teamController.removeTeamMember);

module.exports = router;
