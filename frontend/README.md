# 🎓 CEMS — Campus Event Management System

<div align="center">

![CEMS Banner](https://img.shields.io/badge/CEMS-Campus%20Event%20Management-2563eb?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)

**A full-stack web application for managing campus events — built for students, faculty, and administrators.**

🔗 [GitHub Repository](https://github.com/deekshagarg1/cems)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Developers](#-developers)

---

## 📖 About

**CEMS (Campus Event Management System)** is a comprehensive platform designed to streamline how students discover and register for campus events, how faculty create and manage them, and how administrators oversee the entire ecosystem.

> Developed as a part of MCA curriculum project at **Madhav Institute of Technology and Science (MITS), Gwalior**.

---

## ✨ Features

### 👨‍🎓 Student
- Browse and search all campus events with category filters
- Register for events with one click
- View registered events (upcoming & past)
- Submit feedback after attending events
- Download professional participation certificates (PDF)
- View and edit personal profile with photo upload

### 👨‍🏫 Faculty
- Create events with banner images, descriptions, categories
- Manage own events — edit, delete
- View my events page with search

### 🛡️ Admin
- Full CRUD on all events
- Manage students — edit, delete, view and cancel registrations
- Manage faculty — activate, deactivate, delete, view their events
- View all registrations across all events with CSV export

### 🌐 General
- Dark / Light theme toggle
- Fully responsive design
- Profile page with photo upload and edit
- About, Contact pages
- Professional certificate with gold border design

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Axios, CSS Variables |
| **Backend** | Node.js v22, Express.js |
| **Database** | MySQL 8.0 |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **File Upload** | Multer |
| **Fonts** | Playfair Display, DM Sans, Sora (Google Fonts) |

---

## 📁 Project Structure

```
newCEMS/
├── frontend/                     # React App
│   └── src/
│       ├── assets/
│       │   └── css/              # Global CSS files
│       │       ├── pages.css
│       │       ├── Events.css
│       │       ├── Profile.css
│       │       └── ...
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── Footer.jsx
│       └── pages/
│           ├── Home.js
│           ├── Events.js
│           ├── EventDetail.js
│           ├── Login.js
│           ├── Signup.js
│           ├── About.js
│           ├── Contact.js
│           ├── Profile.js
│           ├── admin/
│           │   ├── AdminManageEvents.js
│           │   ├── AdminManageStudents.js
│           │   ├── AdminManageFaculty.js
│           │   └── Registrations.js
│           ├── faculty/
│           │   ├── CreateEvent.js
│           │   └── MyEvents.js
│           └── student/
│               ├── RegisteredEvents.js
│               ├── Certificate.js
│               └── MyCertificates.js
│
└── backend/                      # Express API
    ├── config/
    │   └── db.js                 # MySQL connection
    ├── controllers/
    │   ├── authController.js
    │   ├── eventController.js
    │   ├── adminController.js
    │   └── feedbackController.js
    ├── middleware/
    │   ├── auth.js               # JWT verification
    │   └── upload.js             # Multer config
    ├── routes/
    │   ├── authRoutes.js
    │   ├── eventRoutes.js
    │   ├── adminRoutes.js
    │   └── feedbackRoutes.js
    ├── uploads/                  # Uploaded images
    │   └── profiles/
    └── index.js                  # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8.0+
- npm
- Git

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/deekshagarg1/cems.git
cd cems
```

---

### Step 2 — Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dcems
JWT_SECRET=cems_secret_key_2024
```

---

### Step 3 — Setup MySQL Database

Open **phpMyAdmin** or **MySQL Workbench** and run this SQL:

```sql
CREATE DATABASE dcems;
USE dcems;

CREATE TABLE students (
  student_id    INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password      VARCHAR(255) NOT NULL,
  enrollment_no VARCHAR(50),
  course        VARCHAR(100),
  semester      INT,
  profile_pic   VARCHAR(255),
  status        VARCHAR(20) DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faculty (
  faculty_id  INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  profile_pic VARCHAR(255),
  status      VARCHAR(20) DEFAULT 'active',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE events (
  event_id    INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  category    VARCHAR(50) DEFAULT 'Other',
  event_date  DATE,
  location    VARCHAR(200),
  image       VARCHAR(255),
  created_by  INT,
  role        ENUM('admin','faculty'),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_registrations (
  registration_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id        INT NOT NULL,
  student_id      INT NOT NULL,
  registered_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id)   REFERENCES events(event_id)   ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  UNIQUE KEY unique_reg (event_id, student_id)
);

CREATE TABLE feedback (
  feedback_id  INT AUTO_INCREMENT PRIMARY KEY,
  event_id     INT NOT NULL,
  student_id   INT NOT NULL,
  rating       INT DEFAULT 0,
  organization INT DEFAULT 0,
  content      INT DEFAULT 0,
  highlight    TEXT,
  improve      TEXT,
  recommend    VARCHAR(20),
  comments     TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id)   REFERENCES events(event_id)   ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  UNIQUE KEY unique_feedback (event_id, student_id)
);

-- Default Admin (password: admin123)
INSERT INTO admin (name, password)
VALUES ('admin', '$2b$10$YdiHjAfBCPxUt90Zru2h9eUQQoL058TGxKwPb6fHTUP1LG/JIgNjm');
```

---

### Step 4 — Start Backend Server

```bash
cd backend
node index.js
```

> ✅ Server running on **http://localhost:5000**

---

### Step 5 — Setup & Start Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

> ✅ App running on **http://localhost:3000**

---

### Default Login Credentials

| Role | Field | Value |
|------|-------|-------|
| Admin | Name | `admin` |
| Admin | Password | `admin123` |
| Student | — | Register at `/sign` |
| Faculty | — | Register at `/sign` |

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `password` |
| `DB_NAME` | Database name | `dcems` |
| `JWT_SECRET` | Secret key for JWT | `cems_secret_2024` |

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/student/register` | Public |
| POST | `/student/login` | Public |
| GET | `/student/profile` | Student |
| PUT | `/student/update` | Student |
| POST | `/faculty/register` | Public |
| POST | `/faculty/login` | Public |
| GET | `/faculty/profile` | Faculty |
| PUT | `/faculty/update` | Faculty |
| POST | `/admin/login` | Public |

### Events — `/api/events`
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/` | Public |
| GET | `/:id` | Public |
| POST | `/create` | Faculty |
| PUT | `/update/:id` | Faculty |
| DELETE | `/delete/:id` | Faculty |
| POST | `/register` | Student |
| GET | `/my-registrations` | Student |
| GET | `/my-events` | Faculty |
| GET | `/all-registrations` | Admin |

### Admin — `/api/admin`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | All events |
| PUT | `/events/:id` | Edit event |
| DELETE | `/events/:id` | Delete event |
| GET | `/students` | All students |
| PUT | `/students/:id` | Edit student |
| DELETE | `/students/:id` | Delete student |
| GET | `/students/:id/registrations` | Student registrations |
| DELETE | `/registrations/:id` | Cancel registration |
| GET | `/faculty` | All faculty |
| DELETE | `/faculty/:id` | Delete faculty |
| PATCH | `/faculty/:id/status` | Toggle active/inactive |
| GET | `/faculty/:id/events` | Faculty events |

### Feedback — `/api/feedback`
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/submit` | Student |
| GET | `/event/:id` | Admin |

---

## 🗄️ Database Schema

```
students ──┐
           ├── event_registrations ──── events ──── feedback
faculty ───┤                                  ↑
           └──────────────────────────────────┘
admin ──────────────────────────── events
```

---

## 👥 Developers

<table>
  <tr>
    <td align="center">
      <b>Deeksha Garg</b><br/>
      MCA, I Year<br/>
      MITS, Gwalior<br/>
      <a href="https://github.com/deekshagarg1">GitHub</a>
    </td>
    <td align="center">
      <b>Pulkit Mishra</b><br/>
      MCA, I Year<br/>
      MITS, Gwalior
    </td>
  </tr>
</table>

### 🎓 Under the Guidance of

**Prof. R.S. Jadon**  
Faculty Guide · MCA Department  
Madhav Institute of Technology and Science (MITS), Gwalior

---

## 📄 License

This project is developed for academic purposes at **Madhav Institute of Technology and Science (MITS), Gwalior**.

---

<div align="center">
  Made with ❤️ by <b>Deeksha Garg</b> & <b>Pulkit Mishra</b><br/>
  MCA · MITS, Gwalior
</div>