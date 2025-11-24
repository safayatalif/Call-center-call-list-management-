const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all report routes - only ADMIN and MANAGER can access reports
router.use(authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']));

// Report endpoints
router.get('/team-summary', reportController.getTeamSummary);
router.get('/agent-performance', reportController.getAgentPerformance);
router.get('/call-statistics', reportController.getCallStatistics);
router.get('/activity-logs', reportController.getActivityLogs);
router.get('/dashboard-summary', reportController.getDashboardSummary);

module.exports = router;
