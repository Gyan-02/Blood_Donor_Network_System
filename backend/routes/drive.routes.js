const express = require('express');
const router = express.Router();
const { getAllDrives, bookAppointment } = require('../services/drive.service');

// GET /api/drives
router.get('/', (req, res) => {
    const drives = getAllDrives();
    res.json({ success: true, count: drives.length, data: drives });
});

// POST /api/drives/:id/book
router.post('/:id/book', (req, res) => {
    const { donorId } = req.body;
    const result = bookAppointment(req.params.id, donorId);
    const status = result.success ? 200 : 400;
    res.status(status).json(result);
});

module.exports = router;
