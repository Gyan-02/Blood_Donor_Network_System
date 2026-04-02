const db = require('../config/db');

/**
 * Reserves blood bags for a specific request using FIFO strategy.
 * CRITICAL: Uses a Transaction to ensure no race conditions.
 * 
 * @param {string} bloodType - The required blood type (e.g., 'A+', 'O-').
 * @param {number} quantity - Number of bags needed.
 * @param {number} requestId - The ID of the request triggering this reservation.
 * @returns {Promise<object>} - Result of the reservation.
 */
async function reserveBloodBags(bloodType, quantity, requestId) {
    const connection = await db.getConnection(); // Get a dedicated connection from the pool

    try {
        // Step 1: Start Transaction
        await connection.beginTransaction();

        // Step 2: Find & Lock the specific bags (The "Select" Phase)
        // We select only the IDs needed, prioritizing oldest expiry date.
        // FOR UPDATE locks these rows preventing other transactions from picking them.
        const [rows] = await connection.execute(
            `SELECT id FROM blood_bags 
             WHERE status = 'AVAILABLE' 
               AND blood_type = ? 
               AND expiry_date > NOW() 
             ORDER BY expiry_date ASC 
             LIMIT ? 
             FOR UPDATE`,
            [bloodType, quantity]
        );

        if (rows.length < quantity) {
            throw new Error(`Insufficient blood bags available. Needed ${quantity}, found ${rows.length}.`);
        }

        const bagIds = rows.map(row => row.id);

        // Step 3: Update the status (The "Action" Phase)
        // We assume bagIds is an array of integers.
        // We must construct the placeholder string for the IN clause manually or carefully.
        const placeholders = bagIds.map(() => '?').join(',');

        await connection.execute(
            `UPDATE blood_bags 
             SET status = 'RESERVED', 
                 reserved_for_request_id = ? 
             WHERE id IN (${placeholders})`,
            [requestId, ...bagIds]
        );

        // Step 4: Commit
        await connection.commit();

        return {
            success: true,
            message: `Successfully reserved ${quantity} bags of ${bloodType}.`,
            reserved_bag_ids: bagIds
        };

    } catch (error) {
        // Rollback in case of any error
        await connection.rollback();
        throw error;
    } finally {
        // Always release the connection back to the pool
        connection.release();
    }
}

module.exports = { reserveBloodBags };
