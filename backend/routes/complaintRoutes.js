const express = require('express');
const router = express.Router();

const complaintController = require('../controllers/complaintController');

router.post('/', complaintController.addComplaint);

router.get('/', complaintController.getAllComplaints);

router.get('/email/:email', complaintController.getComplaintsByEmail);

router.put('/:id', complaintController.updateComplaintStatus);

module.exports = router;