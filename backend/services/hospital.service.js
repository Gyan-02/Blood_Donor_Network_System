const db = require('../config/db');

/**
 * Finds hospitals near a given location.
 * Uses MySQL ST_Distance_Sphere for accurate earth-distance calculation.
 * 
 * @param {number} longitude - User's longitude.
 * @param {number} latitude - User's latitude.
 * @param {number} maxDistanceMeters - Search radius in meters (default 5000).
 * @returns {Promise<Array>} - List of hospitals with distance.
 */
async function findNearestHospitals(longitude, latitude, maxDistanceMeters = 5000) {
    // Note: ST_GeomFromText takes 'POINT(Long Lat)' - Longitude first!
    const query = `
        SELECT 
            id, 
            name, 
            ST_Distance_Sphere(
                location_coordinates, 
                ST_GeomFromText('POINT(? ?)', 4326)
            ) as distance_meters
        FROM hospitals
        WHERE ST_Distance_Sphere(
                location_coordinates, 
                ST_GeomFromText('POINT(? ?)', 4326)
            ) < ?
        ORDER BY distance_meters ASC
    `;

    // We pass longitude/latitude twice because they appear twice in the query
    const [rows] = await db.execute(query, [longitude, latitude, longitude, latitude, maxDistanceMeters]);
    return rows;
}

module.exports = { findNearestHospitals };
