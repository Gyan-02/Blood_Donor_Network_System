// Mock donor data for demonstration
const MOCK_DONORS = [
    { id: 1, full_name: 'Arjun Patel', blood_group: 'O+', age: 28, total_donations: 12, availability_status: 'Available', lat: 13.0835, lng: 80.2707, last_donation: '2026-01-15', member_since: '2022-06-10', contact: '+91 98765 43210' },
    { id: 2, full_name: 'Sneha Reddy', blood_group: 'A+', age: 25, total_donations: 8, availability_status: 'Available', lat: 13.0801, lng: 80.2838, last_donation: '2026-02-20', member_since: '2023-01-05', contact: '+91 87654 32109' },
    { id: 3, full_name: 'Rahul Sharma', blood_group: 'B+', age: 32, total_donations: 22, availability_status: 'Unavailable', lat: 13.0674, lng: 80.2376, last_donation: '2025-12-01', member_since: '2020-03-15', contact: '+91 76543 21098' },
    { id: 4, full_name: 'Priya Nair', blood_group: 'AB-', age: 29, total_donations: 5, availability_status: 'Available', lat: 13.0524, lng: 80.2508, last_donation: '2026-03-01', member_since: '2024-07-20', contact: '+91 65432 10987' },
    { id: 5, full_name: 'Karthik Subramanian', blood_group: 'O-', age: 35, total_donations: 31, availability_status: 'Available', lat: 13.0878, lng: 80.2785, last_donation: '2026-02-10', member_since: '2019-11-30', contact: '+91 54321 09876' },
    { id: 6, full_name: 'Ananya Gupta', blood_group: 'A-', age: 27, total_donations: 15, availability_status: 'Available', lat: 13.0612, lng: 80.2623, last_donation: '2026-01-25', member_since: '2021-09-12', contact: '+91 43210 98765' },
    { id: 7, full_name: 'Vikram Singh', blood_group: 'B-', age: 30, total_donations: 18, availability_status: 'Available', lat: 13.0745, lng: 80.2190, last_donation: '2026-03-05', member_since: '2021-04-18', contact: '+91 32109 87654' },
    { id: 8, full_name: 'Divya Menon', blood_group: 'AB+', age: 24, total_donations: 3, availability_status: 'Available', lat: 13.0900, lng: 80.2550, last_donation: '2026-02-28', member_since: '2025-05-01', contact: '+91 21098 76543' },
];

function getActiveDonorStats(lat, lng, bloodType) {
    const nearby = MOCK_DONORS.filter(d => d.availability_status === 'Available');
    const compatible = bloodType
        ? nearby.filter(d => d.blood_group === bloodType)
        : nearby;
    return {
        total_active: nearby.length,
        compatible_count: compatible.length,
        donors: nearby.map(d => ({
            id: d.id,
            lat: d.lat,
            lng: d.lng,
            blood_group: d.blood_group,
            availability_status: d.availability_status,
        })),
    };
}

function getDonorProfile(donorId) {
    const donor = MOCK_DONORS.find(d => d.id === parseInt(donorId));
    if (!donor) return null;
    return {
        ...donor,
        lives_saved: Math.floor(donor.total_donations * 3),
        badges: donor.total_donations >= 20 ? ['Platinum Hero', 'Lifesaver Legend'] :
                donor.total_donations >= 10 ? ['Gold Hero', 'Community Champion'] :
                donor.total_donations >= 5 ? ['Silver Hero'] : ['Bronze Starter'],
        donation_history: Array.from({ length: Math.min(donor.total_donations, 6) }, (_, i) => ({
            id: i + 1,
            date: new Date(Date.now() - i * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            location: ['City Hospital', 'SRM Campus Drive', 'General Hospital', 'Red Cross Center'][i % 4],
            type: ['Whole Blood', 'Plasma', 'Platelets'][i % 3],
        })),
    };
}

module.exports = { getActiveDonorStats, getDonorProfile, MOCK_DONORS };
