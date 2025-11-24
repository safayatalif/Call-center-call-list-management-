const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const dataMaskingMiddleware = require('../middleware/dataMaskingMiddleware');

// Protect all admin routes
router.use(authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']));

router.post('/agents', adminController.createAgent);
router.get('/agents', adminController.getAgents);
router.put('/agents/:id', adminController.updateAgent);

// Project Routes
router.post('/projects', adminController.createProject);
router.get('/projects', adminController.getProjects);
router.put('/projects/:id', adminController.updateProject);
router.delete('/projects/:id', adminController.deleteProject);

// Customer Routes (with data masking)
const customerController = require('../controllers/customerController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/projects/:id/upload-customers', upload.single('file'), customerController.uploadCustomers);
router.get('/projects/:id/customers', dataMaskingMiddleware, customerController.getCustomers);

// Assignment Routes
const assignmentController = require('../controllers/assignmentController');
router.get('/agents/:agentId/capacity', assignmentController.checkAgentCapacity);
router.post('/assign', assignmentController.assignCustomers);
router.post('/reassign', assignmentController.reassignCustomers);
router.post('/bulk-update', assignmentController.bulkUpdateAssignments);
router.get('/assignments/:assignmentId/history', assignmentController.getAssignmentHistory);
router.get('/agent/:id/customers', assignmentController.getAgentCustomers);

module.exports = router;
