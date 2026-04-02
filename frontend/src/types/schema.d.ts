export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type RequestStatus = 'PENDING' | 'FULFILLED' | 'CANCELLED';

export type UrgencyLevel = 'CRITICAL' | 'PLANNED';

export type ComponentType = 'Whole Blood' | 'Plasma' | 'Platelets' | 'Red Cells';

export interface BloodBag {
    id: number;
    blood_type: BloodType;
    expiry_date: string;
    status: 'AVAILABLE' | 'RESERVED' | 'USED' | 'EXPIRED';
    location_id: number;
}

export interface Hospital {
    id: number;
    name: string;
    address: string;
    location_coordinates: {
        x: number; // Longitude
        y: number; // Latitude
    };
    distance_meters?: number;
}

export interface CreateRequestPayload {
    patient_name: string;
    blood_type: BloodType;
    quantity: number;
    urgency: UrgencyLevel;
    latitude: number;
    longitude: number;
    hospital_name?: string;
    required_by?: string;
    contact_method?: 'anonymous' | 'whatsapp' | 'sms';
    transport_needed?: boolean;
}

export interface Donor {
    id: number;
    full_name: string;
    blood_group: BloodType;
    age: number;
    total_donations: number;
    availability_status: 'Available' | 'Unavailable';
    lat: number;
    lng: number;
    last_donation: string;
    member_since: string;
    contact: string;
    lives_saved?: number;
    badges?: string[];
    donation_history?: DonationRecord[];
}

export interface DonationRecord {
    id: number;
    date: string;
    location: string;
    type: string;
}

export interface DonationDrive {
    id: number;
    name: string;
    organizer: string;
    location: string;
    lat: number;
    lng: number;
    start_time: string;
    end_time: string;
    status: 'Active' | 'Upcoming' | 'Completed';
    total_slots: number;
    booked_slots: number;
    available_slots: number;
    description: string;
}

export interface Appointment {
    id: number;
    drive_id: number;
    donor_id: string;
    booked_at: string;
}

export interface BloodBank {
    id: number;
    name: string;
    lat: number;
    lng: number;
    inventory: Record<BloodType, number>;
}

export interface CriticalRequest {
    id: number;
    blood_type: BloodType;
    urgency: string;
    hospital: string;
    hospital_lat: number;
    hospital_lng: number;
    patient: string;
    units_needed: number;
    created_at: string;
}

export interface InventoryItem {
    component_type: ComponentType;
    quantity_ml: number;
    total_bags: number;
    expiring_soon: number;
    batch_numbers: string[];
}

export interface ExpiringBatch {
    id: number;
    batch_number: string;
    component_type: ComponentType;
    blood_type: BloodType;
    quantity_ml: number;
    collection_date: string;
    expiry_date: string;
    status: 'Available' | 'Expiring' | 'Expired';
    location: string;
}

export interface DashboardStats {
    total_bags: number;
    total_banks: number;
    critical_requests: number;
    pending_requests: number;
    banks: BloodBank[];
    critical: CriticalRequest[];
}
