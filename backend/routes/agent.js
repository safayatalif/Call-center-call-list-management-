const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const dataMaskingMiddleware = require('../middleware/dataMaskingMiddleware');

router.use(authMiddleware, roleMiddleware(['AGENT', 'TRAINEE', 'MANAGER']));

router.get('/my-calls', dataMaskingMiddleware, agentController.getMyCalls);
router.get('/calls/filter', dataMaskingMiddleware, agentController.getFilteredCalls);
router.post('/call/:id/update-status', agentController.updateCallStatus);
router.post('/call/:id/schedule', agentController.scheduleNextContact);
router.get('/call/:id/history', agentController.getCallHistory);

module.exports = router;

