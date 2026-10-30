# 🩺 MediBook – Doctor Appointment Management System

### Manage doctors and appointments with ease.

MediBook is a modern web-based doctor appointment management system built with **React, Vite, and Supabase**. It provides separate dashboards for administrators and doctors, making it easier to manage doctors, monitor appointments, and handle daily appointment operations.

## ✨ Features

### 🔐 Authentication
- Secure login using Supabase Authentication.
- Role-based access for Admin and Doctor.
- Password reset functionality.
- Change password functionality.
- Separate dashboards based on user roles.

### 👨‍💼 Admin Dashboard
- Overview of doctors and appointments.
- Dashboard statistics for total, pending, confirmed, completed, and cancelled appointments.
- Manage doctor accounts.
- Add new doctors with account creation.
- Edit doctor information.
- Upload and manage doctor profile images.
- View and manage all appointments.
- Search and filter appointments.
- Update appointment statuses.
- Delete appointments with a confirmation dialog.

### 👨‍⚕️ Doctor Dashboard
- Personalized doctor dashboard.
- View personal appointment records.
- Access patient information.
- Search and filter appointments.
- Confirm pending appointments.
- Complete confirmed appointments.
- Cancel appointments.
- Delete appointments with confirmation.
- Manage profile information and profile image.
- Change account password.

### 📅 Appointment Management
- View appointment details.
- Track appointment status.
- Manage pending, confirmed, completed, and cancelled appointments.
- Track payment status.
- Search appointments and filter by status.
- Secure appointment operations based on user roles.

### 🎨 User Interface
- Modern and responsive design.
- Clean dashboard layouts.
- Reusable React components.
- Mantine UI components.
- Lucide React icons.
- Consistent styling and interactive elements.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| Vite | Development server and build tool |
| Supabase | Backend and database |
| Supabase Auth | Authentication |
| PostgreSQL | Database |
| Mantine UI | UI components |
| Lucide React | Icons |
| JavaScript | Application logic |
| CSS | Custom styling |




*The structure above represents the main architectural areas; individual filenames may differ in your project.*

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd doctor-appointment-admin
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Supabase

Create a Supabase project and configure your project URL and publishable key in the Supabase client configuration:

```text
src/lib/supabase.jsx
```

Make sure your Supabase database tables, authentication settings, storage buckets, and Row Level Security (RLS) policies are configured.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 6. Build for production

```bash
npm run build
```
## ⚙️ .env setup

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key

```

## 🔒 Security

- Supabase Authentication for account management.
- Role-based access for administrators and doctors.
- Row Level Security (RLS) for database protection.
- Secure doctor-specific appointment access.
- Protected database operations through Supabase policies and functions.

## 🎯 Project Goal

The goal of MediBook is to simplify doctor and appointment management through a centralized web application. By providing dedicated admin and doctor dashboards, the system makes appointment operations more organized, accessible, and efficient.

## 👩‍💻 Developer

**Amna Ashraf**

Frontend & Mobile App Developer

- GitHub: [@Amna-Coder404](https://github.com/Amna-Coder404)

---

⭐ If you find this project useful, consider giving it a star!