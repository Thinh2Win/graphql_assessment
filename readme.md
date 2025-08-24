# GraphQL Patient Management System

A full-stack application for managing patients and appointments using GraphQL, React, and Prisma.

## Prerequisites

- Node.js (version 16 or higher)
- npm

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Navigate to backend directory
cd backend

# Generate Prisma client and setup database
npm install
```

### 3. Seed Database (Optional)

```bash
# Make sure you're in the backend directory
# Run the seed script to populate with sample data
node seedDb.js
```

### 4. Run the Application

#### Start the Backend Server

```bash
# In the backend directory
npm start
```

The GraphQL server will be running at `http://localhost:4000`

#### Start the Frontend Development Server

```bash
# In a new terminal, navigate to frontend directory
cd frontend
npm run dev
```

The React application will be running at `http://localhost:5173`

## Data Modeling

The application uses Prisma ORM with SQLite database and includes two main entities:

### Patient Model

```prisma
model Patient {
    id String @id @map("patient_id")
    first_name String
    last_name String
    dob String
    email String
    phone String
    address String
    appointments Appointment[]
}
```

**Fields:**
- `id` - Unique patient identifier (Primary Key)
- `first_name` - Patient's first name
- `last_name` - Patient's last name  
- `dob` - Date of birth (MM-DD-YYYY format)
- `email` - Patient's email address (optional)
- `phone` - Patient's phone number (validated US format)
- `address` - Patient's address
- `appointments` - One-to-many relationship with appointments

### Appointment Model

```prisma
model Appointment {
  id String @id @map("appointment_id")
  patient_id String
  appointment_date String
  appointment_type String
  patient Patient @relation(fields: [patient_id], references: [id])
}
```

**Fields:**
- `id` - Unique appointment identifier (Primary Key)
- `patient_id` - Foreign key referencing Patient.id
- `appointment_date` - Date of the appointment (MM-DD-YYYY format)
- `appointment_type` - Type/category of the appointment
- `patient` - Many-to-one relationship with patient

### Relationships

- **Patient → Appointments**: One-to-many relationship where each patient can have multiple appointments
- **Appointment → Patient**: Many-to-one relationship where each appointment belongs to one patient

## Data Validation & CSV Processing

The application implements robust data validation during CSV import through the seeding process (`seedDb.js`). Here's the validation approach and library choices:

### Validation Strategy

#### Date Validation

The CSV validation is designed to be permissive during data import to maximize data retention since the application layer usually enforces stricter validation for user input.

As a result I choice prioritizing successful data import over perfect validation for the seeding process when validating dates, phone numbers, and email. Originally I went with validator.js npm package but found that it was too strict and would mark several phone numbers for example as invalid. For example for 5551234567, this should be a valid test number but validator.js still marks it as invalid. So I went with libphonenumber-js for validation instead. Similarly I did a simple email validation check with just checking for one '@' symbol, at least one character for the local part before the @ symbol, and domain part after the @ symbol. For dates, dayjs npm package offered the cleanest syntax for normalizing dates. 

## Usage

- Backend GraphQL Playground: `http://localhost:4000`
- Frontend Application: `http://localhost:5173`

The application allows you to view and manage patient information and appointments through a GraphQL API and React frontend.

