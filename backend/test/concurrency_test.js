const { reserveBloodBags } = require('../services/inventory.service');
const db = require('../config/db');

// Mock request to verify concurrency
// Note: This test requires a running database with the schema loaded and data inserted.
async function testConcurrency() {
    console.log("Starting Concurrency Test...");

    // Simulate 3 simultaneous requests for 2 'A+' bags
    // Assume we have only 2 bags expiring soon.
    // Result should be: 2 succeed (if picking 1 each) or 1 succeeds (if picking 2).
    // Let's try 3 requests asking for 1 bag each, but only 2 bags are available.

    const requests = [
        { id: 101, type: 'A+', qty: 1 },
        { id: 102, type: 'A+', qty: 1 },
        { id: 103, type: 'A+', qty: 1 }
    ];

    try {
        const results = await Promise.allSettled(requests.map(req =>
            reserveBloodBags(req.type, req.qty, req.id)
        ));

        results.forEach((res, index) => {
            if (res.status === 'fulfilled') {
                console.log(`Request ${requests[index].id}: SUCCESS`, res.value);
            } else {
                console.log(`Request ${requests[index].id}: FAILED`, res.reason.message);
            }
        });

        console.log("Test Complete. Check if exactly 2 requests succeeded and 1 failed.");

    } catch (err) {
        console.error("Test Error:", err);
    } finally {
        // Close connection pool
        // db.end(); // If end method existed on promise pool wrapper, but it doesn't always. 
        process.exit();
    }
}

testConcurrency();
