const express = require('express');
const router = express.Router();
const { getDashboardStats, getInventorySummary } = require('../services/dashboard.service');

// GET /api/dashboard/stats
router.get('/stats', (req, res) => {
    const stats = getDashboardStats();
    res.json({ success: true, data: stats });
});

// GET /api/dashboard/inventory-summary
router.get('/inventory-summary', (req, res) => {
    const summary = getInventorySummary();
    res.json({ success: true, data: summary });
});

module.exports = router;
