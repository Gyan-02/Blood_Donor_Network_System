const express = require('express');
const router = express.Router();
const { getActiveDonorStats, getDonorProfile } = require('../services/donor.service');

// GET /api/donors/stats?lat=13.08&lng=80.27&bloodType=A+
router.get('/stats', (req, res) => {
    const { lat, lng, bloodType } = req.query;
    const stats = getActiveDonorStats(
        parseFloat(lat) || 13.08,
        parseFloat(lng) || 80.27,
        bloodType || null
    );
    res.json({ success: true, data: stats });
});

// GET /api/donors/:id/profile
router.get('/:id/profile', (req, res) => {
    const profile = getDonorProfile(req.params.id);
    if (!profile) {
        return res.status(404).json({ success: false, message: 'Donor not found' });
    }
    res.json({ success: true, data: profile });
});

module.exports = router;
