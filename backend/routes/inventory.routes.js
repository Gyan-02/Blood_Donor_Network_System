const express = require('express');
const router = express.Router();
const { reserveBloodBags } = require('../services/inventory.service');

// POST /api/blood/reserve
router.post('/reserve', async (req, res, next) => {
    try {
        const { bloodType, quantity, requestId } = req.body;

        // Basic validation
        if (!bloodType || !quantity || !requestId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: bloodType, quantity, requestId'
            });
        }

        const result = await reserveBloodBags(bloodType, quantity, requestId);
        res.status(200).json(result);

    } catch (error) {
        // Pass to global error handler
        next(error);
    }
});

module.exports = router;
