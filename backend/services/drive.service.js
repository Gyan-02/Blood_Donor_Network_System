const MOCK_DRIVES = [
    {
        id: 1, name: 'SRM Campus Blood Drive', organizer: 'SRM Red Cross Society',
        location: 'SRM University Main Campus, Kattankulathur',
        lat: 12.8231, lng: 80.0444,
        start_time: '2026-03-20T09:00:00', end_time: '2026-03-20T17:00:00',
        status: 'Active', total_slots: 100, booked_slots: 67,
        description: 'Annual mega blood donation drive. Free health checkup for all donors!',
    },
    {
        id: 2, name: 'City Hospital Emergency Drive', organizer: 'City Hospital Foundation',
        location: 'City Hospital, T. Nagar, Chennai',
        lat: 13.0418, lng: 80.2341,
        start_time: '2026-03-21T08:00:00', end_time: '2026-03-21T14:00:00',
        status: 'Upcoming', total_slots: 50, booked_slots: 12,
        description: 'Urgent drive to replenish O- and AB- stocks. Walk-ins welcome.',
    },
    {
        id: 3, name: 'Tech Park Donation Camp', organizer: 'TIDEL Park Welfare Committee',
        location: 'TIDEL Park, Taramani, Chennai',
        lat: 12.9862, lng: 80.2426,
        start_time: '2026-03-22T10:00:00', end_time: '2026-03-22T16:00:00',
        status: 'Upcoming', total_slots: 75, booked_slots: 30,
        description: 'Corporate blood donation camp with complimentary refreshments.',
    },
    {
        id: 4, name: 'Marina Beach Awareness Drive', organizer: 'Youth Blood Donors Network',
        location: 'Marina Beach, Triplicane, Chennai',
        lat: 13.0500, lng: 80.2824,
        start_time: '2026-03-15T07:00:00', end_time: '2026-03-15T12:00:00',
        status: 'Completed', total_slots: 120, booked_slots: 118,
        description: 'Community drive with blood group testing and awareness sessions.',
    },
];

let appointments = [];

function getAllDrives() {
    return MOCK_DRIVES.map(d => ({
        ...d,
        available_slots: d.total_slots - d.booked_slots,
    }));
}

function bookAppointment(driveId, donorId) {
    const drive = MOCK_DRIVES.find(d => d.id === parseInt(driveId));
    if (!drive) return { success: false, message: 'Drive not found' };
    if (drive.status === 'Completed') return { success: false, message: 'Drive already completed' };
    if (drive.booked_slots >= drive.total_slots) return { success: false, message: 'No slots available' };

    drive.booked_slots++;
    const appointment = {
        id: appointments.length + 1,
        drive_id: parseInt(driveId),
        donor_id: donorId || 'guest',
        booked_at: new Date().toISOString(),
    };
    appointments.push(appointment);

    return { success: true, message: 'Appointment booked!', appointment };
}

module.exports = { getAllDrives, bookAppointment };
