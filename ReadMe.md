# Medical Backend

Medi-Hub is a backend application designed to manage a hospital system. It provides APIs for user authentication, appointment booking, medicine management, testimonials, and more. This project is built using Node.js, Express.js, and MongoDB.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Folder Structure](#folder-structure)
4. [Environment Variables](#environment-variables)
5. [API Endpoints](#api-endpoints)
6. [Setup and Installation](#setup-and-installation)
7. [Testing](#testing)
8. [Contributing](#contributing)
9. [License](#license)

---

## Project Overview

This project is a backend system for a hospital management application. It supports multiple user roles (Admin, Patient, Doctor) and provides APIs for managing users, appointments, medicines, testimonials, and more.

---

## Features

- **User Authentication**: Login and logout for Admins, Patients, and Doctors.
- **Appointment Management**: Book, update, and delete appointments.
- **Medicine Management**: Add, update, delete, and search medicines.
- **Testimonials**: Add and fetch testimonials.
- **File Uploads**: Upload doctor avatars and other files using Cloudinary.
- **Secure**: Uses JWT for authentication and bcrypt for password hashing.
- **Error Handling**: Centralized error handling for better debugging.

---

## Environment Variables

The project uses a `.env` file to manage sensitive information. Below are the required variables:

```plaintext
MONGODB_URI=<Your MongoDB URI>
DB_NAME=<Database Name>
PORT=<Server Port>
JWT_SECRET_KEY=<JWT Secret Key>
JWT_EXPIRES=<JWT Expiration Time>
COOKIE_EXPIRE=<Cookie Expiration Time>
CLOUDINARY_CLOUD_NAME=<Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Cloudinary API Key>
CLOUDINARY_API_SECRET=<Cloudinary API Secret>
SMTP_HOST=<SMTP Host>
SMTP_PORT=<SMTP Port>
SMTP_USER=<SMTP User>
SMTP_PASSWORD=<SMTP Password>
```

## 🔗 GitHub Repository

[https://github.com/BhautikVekariya21/medical-backend](https://github.com/BhautikVekariya21/medical-backend)

---

## 📌 API Endpoints

### 👤 User Routes (`/api/v1/user`)
- `POST /patient/register`: Register a new patient.
- `POST /login`: Login for Admin, Patient, or Doctor.
- `GET /admin/me`: Get logged-in Admin details.
- `GET /patient/me`: Get logged-in Patient details.
- `GET /doctor/me`: Get logged-in Doctor details.
- `GET /admin/logout`: Logout Admin.
- `GET /patient/logout`: Logout Patient.
- `GET /doctor/logout`: Logout Doctor.

### 📅 Appointment Routes (`/api/v1/appointment`)
- `POST /book`: Book an appointment.
- `PUT /update/:id`: Update appointment status.
- `DELETE /delete/:id`: Delete an appointment.
- `GET /getall`: Get all appointments.

### 💊 Medicine Routes (`/api/v1/medicines`)
- `POST /addmedicine`: Add a new medicine.
- `PUT /update-medicine/:id`: Update a medicine.
- `DELETE /delete-medicine/:id`: Delete a medicine.
- `GET /get/:id`: Get a single medicine.
- `GET /shop-by-category/:category`: Get medicines by category.
- `GET /discount`: Get medicines with high discounts.
- `GET /search-medicine`: Search medicines.

### 💬 Testimonial Routes (`/api/v1/testimonial`)
- `POST /add`: Add a new testimonial.
- `GET /getall`: Get all testimonials.

### 📩 Contact Us Routes (`/api/v1/message`)
- `POST /send`: Send a contact message.
- `GET /getall`: Get all contact messages (Admin only).

### 💳 Payment Routes (`/api/v1/payment`)
- `POST /checkout`: Create a mock payment order.
- `POST /paymentverification`: Verify payment (not implemented).

---

## ⚙️ Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/BhautikVekariya21/medical-backend
cd medical-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the required environment variables:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start the Development Server

```bash
npm run dev
```

> Access the API at: `http://localhost:8080`

---

## 🧪 Testing

### 🔧 Manual Testing

You can test the API endpoints using **Postman** or **cURL**.

### ⚙️ Automated Testing

> ❌ Currently, there are no automated test cases implemented.  
> ✅ You can add tests using frameworks like **Jest**, **Mocha**, or **Supertest**.

---

## 📁 File Descriptions

### `app.js`
- Configures the Express app.
- Sets up middleware and routes.
- Handles global error handling.

### `index.js`
- Entry point of the application.
- Loads environment variables.
- Connects to the database and starts the server.

---

### `/src/controllers/`
Business logic for each feature:
- `user.controller.js`: Handles user operations.
- `appointment.controller.js`: Manages appointments.
- `medicine.controller.js`: Medicine CRUD.
- `testimonial.controller.js`: Manages testimonials.
- `contactus.controller.js`: Contact messages.
- `doctor.controller.js`: Doctor-specific operations.

---

### `/src/models/`
Mongoose schemas for MongoDB collections:
- `user.model.js`
- `doctor.model.js`
- `appointment.model.js`
- `medicine.model.js`
- `testimonial.model.js`
- `contactus.model.js`

---

### `/src/routes/`
Defines the API endpoints:
- `user.routes.js`
- `appointment.routes.js`
- `medicine.routes.js`
- `testimonial.routes.js`
- `contactus.routes.js`

---

### `/src/middlewares/`
- `auth.middleware.js`: Authentication middleware for roles.
- `multer.middleware.js`: File upload middleware.

---

### `/src/utils/`
Utility functions:
- `jwtToken.js`: JWT token generation and management.
- `cloudinary.js`: File uploads using Cloudinary.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.
2. Create a new **feature branch**:
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a **Pull Request**.

---
