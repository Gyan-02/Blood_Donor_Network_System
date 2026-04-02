-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS blood_bags;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS donors;
DROP TABLE IF EXISTS hospitals;

-- Create Hospitals Table (Spatial Data)
CREATE TABLE hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    location_coordinates POINT NOT NULL SRID 4326, -- store as (Long, Lat)
    SPATIAL INDEX (location_coordinates)
) ENGINE=InnoDB;

-- Create Requests Table
CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status ENUM('PENDING', 'FULFILLED', 'CANCELLED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create Blood Bags Table (Inventory)
CREATE TABLE blood_bags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    expiry_date DATETIME NOT NULL,
    status ENUM('AVAILABLE', 'RESERVED', 'USED') DEFAULT 'AVAILABLE',
    location_id INT NOT NULL,
    reserved_for_request_id INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES hospitals(id),
    FOREIGN KEY (reserved_for_request_id) REFERENCES requests(id),
    -- Composite index for the "Oldest First" FIFO query
    INDEX idx_status_type_expiry (status, blood_type, expiry_date)
) ENGINE=InnoDB;

-- Create Donors Table (Optional for now, but good structure)
CREATE TABLE donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    last_donation_date DATE,
    contact_info VARCHAR(255)
) ENGINE=InnoDB;

-- Seed Data (Optional, for testing)
INSERT INTO hospitals (name, location_coordinates) VALUES 
('City Hospital', ST_GeomFromText('POINT(77.12 28.53)', 4326)), -- Near user example
('General Hospital', ST_GeomFromText('POINT(77.15 28.55)', 4326));

INSERT INTO blood_bags (blood_type, expiry_date, status, location_id) VALUES
('A+', DATE_ADD(NOW(), INTERVAL 5 DAY), 'AVAILABLE', 1),
('A+', DATE_ADD(NOW(), INTERVAL 2 DAY), 'AVAILABLE', 1), -- Oldest usable
('O-', DATE_ADD(NOW(), INTERVAL 10 DAY), 'AVAILABLE', 1);
