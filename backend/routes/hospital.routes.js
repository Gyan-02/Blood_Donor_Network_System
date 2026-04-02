const express = require('express');
const router = express.Router();
const { findNearestHospitals } = require('../services/hospital.service');

// GET /api/hospitals/nearest?lat=28.53&lng=77.12
router.get('/nearest', async (req, res, next) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Missing latitude or longitude query parameters'
            });
        }

        // Convert query params to float numbers
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const maxDist = radius ? parseInt(radius) : 5000; // Default 5000m

        const hospitals = await findNearestHospitals(longitude, latitude, maxDist);

        res.json({
            success: true,
            count: hospitals.length,
            data: hospitals
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
