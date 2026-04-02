# 🩸 BloodNet — Blood Donor Network System

A full-stack **Blood Bank Database Management System** built as a DBMS course project. BloodNet provides a premium dark-mode dashboard for managing blood inventory, donor profiles, donation drives, hospital coordination, and real-time blood request tracking — all powered by a MySQL relational database with spatial query support.

---

## 📸 Features at a Glance

| Feature | Description |
|---|---|
| **🚑 Request Blood** | Submit urgent or planned blood requests with geolocation, hospital matching, and real-time urgency indicators |
| **📊 Live Pulse Dashboard** | Real-time overview of blood bank inventory, critical requests, and geospatial hospital/bank distribution on an interactive map |
| **🧪 Blood Vault (Inventory)** | Manage blood component inventory — whole blood, plasma, platelets, red cells — with batch tracking and expiry alerts |
| **📍 Drive Finder** | Discover upcoming and active blood donation drives on a map, book appointment slots |
| **🦸 Hero Profile** | Donor profile page with donation history, badges, availability status, and lifetime stats |

---

## 🏗️ Architecture

```
Blood Donor DBMS Project/
├── backend/                  # Express.js REST API
│   ├── config/
│   │   └── db.js             # MySQL2 connection pool (promise-based)
│   ├── database/
│   │   └── schema.sql        # Full database schema with seed data
│   ├── routes/
│   │   ├── dashboard.routes.js
│   │   ├── donor.routes.js
│   │   ├── drive.routes.js
│   │   ├── hospital.routes.js
│   │   └── inventory.routes.js
│   ├── services/
│   │   ├── dashboard.service.js
│   │   ├── donor.service.js
│   │   ├── drive.service.js
│   │   ├── hospital.service.js
│   │   └── inventory.service.js
│   ├── index.js              # Express server entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/                 # React + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── RequestBloodForm.tsx
│   │   │   ├── LivePulseDashboard.tsx
│   │   │   ├── BloodVaultInventory.tsx
│   │   │   ├── DriveFinder.tsx
│   │   │   └── HeroProfile.tsx
│   │   ├── hooks/
│   │   │   └── useGeolocation.ts
│   │   ├── types/
│   │   │   └── schema.d.ts
│   │   ├── App.tsx           # Router & sidebar layout
│   │   ├── index.css         # Dark-mode design system
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
└── README.md                 # ← You are here
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Type-safe development |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling with custom dark theme |
| **React Router v7** | Client-side routing |
| **TanStack React Query** | Server state management & caching |
| **React Hook Form + Zod** | Form handling with schema validation |
| **Leaflet + React Leaflet** | Interactive maps for hospitals, drives, and geolocation |
| **Lucide React** | Icon library |
| **Axios** | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MySQL 2** | Database driver (promise-based pool) |
| **Zod** | Request validation |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |
| **Nodemon** | Development auto-restart |

### Database
| Technology | Purpose |
|---|---|
| **MySQL** | Relational database engine |
| **InnoDB** | Storage engine with foreign key support |
| **Spatial Indexes (SRID 4326)** | Geospatial queries for hospital proximity |

---

## 🗄️ Database Schema (ER Overview)

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│  hospitals   │       │   blood_bags     │       │  requests   │
├─────────────┤       ├──────────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ location_id (FK) │       │ id (PK)     │
│ name        │       │ id (PK)          │──────►│ patient_name│
│ address     │       │ blood_type       │  FK   │ blood_type  │
│ location_   │       │ expiry_date      │       │ quantity    │
│  coordinates│       │ status           │       │ status      │
│ (POINT)     │       │ reserved_for_    │       │ created_at  │
│             │       │  request_id (FK) │       │             │
└─────────────┘       └──────────────────┘       └─────────────┘

                      ┌─────────────┐
                      │   donors    │
                      ├─────────────┤
                      │ id (PK)     │
                      │ name        │
                      │ blood_type  │
                      │ last_       │
                      │  donation   │
                      │ contact_info│
                      └─────────────┘
```

**Key DBMS Concepts Demonstrated:**
- **Foreign Key Constraints** — `blood_bags.location_id → hospitals.id`, `blood_bags.reserved_for_request_id → requests.id`
- **ENUM Types** — Blood type validation at the database level (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`)
- **Spatial Indexes** — `POINT` data type with SRID 4326 for hospital geolocation
- **Composite Indexes** — `(status, blood_type, expiry_date)` for efficient FIFO inventory queries
- **Transaction Safety** — InnoDB engine for ACID-compliant operations

---

## 🔌 API Endpoints

### Blood Inventory — `/api/blood`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/blood/inventory` | Get blood inventory grouped by component type |
| `GET` | `/api/blood/expiring` | Get batches expiring soon |
| `POST` | `/api/blood/request` | Submit a new blood request |

### Hospitals — `/api/hospitals`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/hospitals` | List all hospitals |
| `GET` | `/api/hospitals/nearby` | Find hospitals near a geographic point (spatial query) |

### Donors — `/api/donors`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/donors` | List all donors |
| `GET` | `/api/donors/:id` | Get donor profile with history |
| `POST` | `/api/donors` | Register a new donor |

### Donation Drives — `/api/drives`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/drives` | List all donation drives |
| `POST` | `/api/drives/:id/book` | Book a slot in a drive |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregate stats (total bags, banks, critical requests) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MySQL** ≥ 8.0 (with spatial function support)
- **npm** (comes with Node.js)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Blood donor dbms project"
```

### 2. Set Up the Database

```bash
# Log into MySQL
mysql -u root -p

# Inside MySQL shell:
CREATE DATABASE blood_bank_db;
USE blood_bank_db;
SOURCE backend/database/schema.sql;
```

### 3. Configure Environment Variables

Edit `backend/.env` with your MySQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blood_bank_db
```

### 4. Install Dependencies & Run

#### Backend
```bash
cd backend
npm install
node index.js
# Server starts on http://localhost:3000
```

#### Frontend (in a separate terminal)
```bash
cd frontend
npm install
npm run dev
# App opens on http://localhost:5173
```

---

## 🎨 Design System

The frontend uses a **premium dark-mode aesthetic** with a custom color palette:

| Token | Color | Usage |
|---|---|---|
| `blood-red` | `#E63946` | Primary accent, urgency indicators, CTA buttons |
| `medical-blue` | `#457B9D` | Secondary accent, informational elements |
| `dark-bg` | Deep charcoal | Page background |
| `dark-surface` | Elevated dark | Cards, sidebar |
| `dark-elevated` | Lighter dark | Hover states, dropdowns |
| `dark-text` | Off-white | Primary text |
| `dark-muted` | Gray | Secondary text |

Typography uses the **Outfit** font family for a clean, modern feel.

---

## 📁 Key Frontend Pages

| Route | Component | Description |
|---|---|---|
| `/request` | `RequestBloodForm` | Multi-field form with geolocation, urgency toggle, hospital auto-detection, and real-time validation via Zod schemas |
| `/dashboard` | `LivePulseDashboard` | Aggregate stats cards, interactive Leaflet map with blood bank markers, and critical request feed |
| `/inventory` | `BloodVaultInventory` | Inventory table grouped by component type, batch-level expiry tracking, and status badges |
| `/drives` | `DriveFinder` | Map-based view of active/upcoming donation drives with slot booking |
| `/profile` | `HeroProfile` | Donor stats dashboard with donation history, badges, and availability toggle |

---

## 🧪 DBMS Concepts Covered

This project demonstrates the following database management concepts:

- **Relational Schema Design** — Normalized tables with proper primary/foreign keys
- **ENUM Constraints** — Database-level validation for blood types and statuses
- **Spatial Data & Queries** — `POINT` geometry type, `ST_Distance_Sphere()`, spatial indexing
- **Composite Indexing** — Optimized queries for FIFO blood bag retrieval
- **Connection Pooling** — Efficient database access via `mysql2` promise pool
- **ACID Transactions** — InnoDB engine ensuring data integrity
- **CRUD Operations** — Full create, read, update, delete lifecycle
- **Aggregation Queries** — Dashboard statistics via `GROUP BY`, `COUNT`, `SUM`

---

## 📝 License

This project is developed as part of a **DBMS academic course project**.

---

<p align="center">
  Built with 🩸 by the BloodNet Team
</p>
