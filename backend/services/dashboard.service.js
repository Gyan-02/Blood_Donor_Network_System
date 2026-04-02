const MOCK_BLOOD_BANKS = [
    { id: 1, name: 'City Hospital Blood Bank', lat: 13.0835, lng: 80.2707, inventory: { 'A+': 45, 'A-': 12, 'B+': 38, 'B-': 8, 'AB+': 15, 'AB-': 4, 'O+': 52, 'O-': 18 } },
    { id: 2, name: 'General Hospital Blood Bank', lat: 13.0674, lng: 80.2376, inventory: { 'A+': 30, 'A-': 7, 'B+': 25, 'B-': 5, 'AB+': 10, 'AB-': 2, 'O+': 40, 'O-': 14 } },
    { id: 3, name: 'Apollo Blood Center', lat: 13.0524, lng: 80.2508, inventory: { 'A+': 60, 'A-': 20, 'B+': 55, 'B-': 12, 'AB+': 22, 'AB-': 8, 'O+': 70, 'O-': 25 } },
    { id: 4, name: 'Red Cross Blood Bank', lat: 13.0612, lng: 80.2623, inventory: { 'A+': 35, 'A-': 10, 'B+': 28, 'B-': 6, 'AB+': 14, 'AB-': 3, 'O+': 48, 'O-': 16 } },
];

const MOCK_CRITICAL_REQUESTS = [
    { id: 101, blood_type: 'O-', urgency: 'Critical', hospital: 'City Hospital', hospital_lat: 13.0835, hospital_lng: 80.2707, patient: 'Patient A', units_needed: 3, created_at: new Date().toISOString() },
    { id: 102, blood_type: 'AB-', urgency: 'Critical', hospital: 'General Hospital', hospital_lat: 13.0674, hospital_lng: 80.2376, patient: 'Patient B', units_needed: 2, created_at: new Date(Date.now() - 1800000).toISOString() },
];

const MOCK_INVENTORY_SUMMARY = [
    { component_type: 'Whole Blood', quantity_ml: 12500, total_bags: 50, expiring_soon: 5, batch_numbers: ['WB-2026-001', 'WB-2026-002', 'WB-2026-003'] },
    { component_type: 'Plasma', quantity_ml: 8200, total_bags: 41, expiring_soon: 8, batch_numbers: ['PL-2026-010', 'PL-2026-011'] },
    { component_type: 'Platelets', quantity_ml: 3800, total_bags: 19, expiring_soon: 12, batch_numbers: ['PT-2026-020', 'PT-2026-021', 'PT-2026-022'] },
    { component_type: 'Red Cells', quantity_ml: 15400, total_bags: 62, expiring_soon: 3, batch_numbers: ['RC-2026-030', 'RC-2026-031'] },
];

const MOCK_EXPIRING_BATCHES = [
    { id: 1, batch_number: 'WB-2026-001', component_type: 'Whole Blood', blood_type: 'A+', quantity_ml: 450, collection_date: '2026-02-15', expiry_date: '2026-03-22', status: 'Available', location: 'City Hospital Blood Bank' },
    { id: 2, batch_number: 'PT-2026-020', component_type: 'Platelets', blood_type: 'O+', quantity_ml: 200, collection_date: '2026-03-15', expiry_date: '2026-03-20', status: 'Expiring', location: 'Apollo Blood Center' },
    { id: 3, batch_number: 'PL-2026-011', component_type: 'Plasma', blood_type: 'B-', quantity_ml: 200, collection_date: '2026-02-20', expiry_date: '2026-03-21', status: 'Expiring', location: 'Red Cross Blood Bank' },
    { id: 4, batch_number: 'PT-2026-021', component_type: 'Platelets', blood_type: 'AB+', quantity_ml: 200, collection_date: '2026-03-16', expiry_date: '2026-03-21', status: 'Expiring', location: 'General Hospital Blood Bank' },
    { id: 5, batch_number: 'WB-2026-003', component_type: 'Whole Blood', blood_type: 'O-', quantity_ml: 450, collection_date: '2026-02-18', expiry_date: '2026-03-23', status: 'Available', location: 'City Hospital Blood Bank' },
    { id: 6, batch_number: 'PT-2026-022', component_type: 'Platelets', blood_type: 'A-', quantity_ml: 200, collection_date: '2026-03-14', expiry_date: '2026-03-19', status: 'Expired', location: 'Apollo Blood Center' },
];

function getDashboardStats() {
    const totalBags = MOCK_BLOOD_BANKS.reduce((sum, bank) =>
        sum + Object.values(bank.inventory).reduce((s, v) => s + v, 0), 0);
    return {
        total_bags: totalBags,
        total_banks: MOCK_BLOOD_BANKS.length,
        critical_requests: MOCK_CRITICAL_REQUESTS.length,
        pending_requests: 7,
        banks: MOCK_BLOOD_BANKS,
        critical: MOCK_CRITICAL_REQUESTS,
    };
}

function getInventorySummary() {
    return {
        summary: MOCK_INVENTORY_SUMMARY,
        expiring_batches: MOCK_EXPIRING_BATCHES,
    };
}

module.exports = { getDashboardStats, getInventorySummary };
