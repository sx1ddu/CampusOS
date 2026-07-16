# 🎓 CampusOS

> A full-stack campus marketplace that enables students to offer services, rent resources, book campus essentials, make secure payments, and build their reputation within their college community.

<p align="center">

![CampusOS Banner](./client/public/logo.svg)

</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb)

</p>

---

# 🌐 Live Demo

### Frontend

https://campus-kn9stfwmz-siidduuss.vercel.app/

### Backend API

https://campusos-39xt.onrender.com

### Health Check

https://campusos-39xt.onrender.com/api/health

> **Note**
>
> The backend is hosted on Render's free tier, so the first request after inactivity may take **30–50 seconds** while the server wakes up.

---

# 📖 About the Project

CampusOS is a **full-stack MERN application** built exclusively for college students.

Instead of relying on WhatsApp groups or social media to buy, sell, rent, or find services, CampusOS provides a dedicated campus marketplace where students can safely connect with each other.

Students can:

- Offer skills as paid services
- Rent out personal resources
- Book services from other students
- Pay securely
- Leave reviews
- Build reputation
- Save favourites
- Receive notifications
- Report inappropriate listings

The objective of this project was to learn how real-world MERN applications are structured while following good backend and frontend development practices.

---

# ✨ Features

## 🔐 Authentication

- Email & Password Login
- Google OAuth Login
- JWT Authentication
- Refresh Tokens
- Email Verification
- Forgot Password
- Reset Password
- Logout

---

## 👤 User Profiles

- Profile setup
- Edit profile
- Upload profile picture
- Public profile pages
- Reputation system

---

## 🛠 Service Marketplace

- Create services
- Edit services
- Delete services
- Category filtering
- Search
- Price filtering
- Service images

Examples:

- Tutoring
- Resume Review
- Graphic Design
- Programming Help

---

## 📦 Resource Marketplace

Students can rent:

- Books
- Calculators
- Cameras
- Electronics
- Lab Equipment

Features include:

- Resource listing
- Availability
- Booking protection
- Double booking prevention

---

## 📅 Booking System

- Book services
- Book rental resources
- Accept bookings
- Reject bookings
- Complete bookings
- Return rented resources

---

## 💳 Payments

Integrated with Razorpay.

- Create payment orders
- Verify payments
- Secure payment flow

---

## ⭐ Reviews & Reputation

- Rate completed bookings
- Leave reviews
- Reputation score
- Average ratings

---

## ❤️ Favorites

Users can save:

- Services
- Resources

---

## 🔔 Notifications

- Booking updates
- Payment updates
- Review notifications
- Automatic cleanup of old notifications

---

## 🛡 Admin Features

- View reports
- Resolve reports
- Manage categories
- Role-based authorization

---

# 🖥 Frontend

The frontend is built using modern React development practices.

### Technologies

- React 19
- Vite
- Tailwind CSS
- React Router
- React Query
- Axios
- React Hook Form
- Zod
- Lucide Icons

### Frontend Features

- Responsive Design
- Modern Landing Page
- Authentication Pages
- Dashboard
- Protected Routes
- Search & Filters
- Loading States
- Error Handling
- Reusable Components
- Clean UI
- Toast Notifications

---

# ⚙ Backend

### Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Google OAuth
- Nodemailer
- Cloudinary
- Multer
- Razorpay

---

# 🛠 Tech Stack

| Frontend | Backend | Database | Other |
|-----------|----------|-----------|--------|
| React | Node.js | MongoDB | JWT |
| Vite | Express | Mongoose | Google OAuth |
| Tailwind CSS | REST API | MongoDB Atlas | Razorpay |
| React Query | Multer | | Cloudinary |
| Axios | Nodemailer | | Render |
| React Hook Form | Express Validator | | Vercel |

---

# 📂 Project Structure

```
CampusOS
│
├── client
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── constants
│   │   ├── context
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── routes
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server
│   ├── src
│   │   ├── config
│   │   ├── constants
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── server.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/sx1ddu/CampusOS.git
cd CampusOS
```

---

## Backend

```bash
cd server
npm install
```

Create

```
.env
```

Start server

```bash
npm run dev
```

---

## Frontend

```bash
cd client
npm install
```

Create

```
.env
```

Run

```bash
npm run dev
```

---

# 🔑 Environment Variables

## Backend

```
PORT=

MONGO_URI=

CLIENT_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

GOOGLE_CLIENT_ID=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## Frontend

```
VITE_API_BASE_URL=
VITE_GOOGLE_CLIENT_ID=
```

---

# 📡 API Modules

- Authentication
- Users
- Categories
- Services
- Resources
- Bookings
- Rentals
- Payments
- Reviews
- Favorites
- Notifications
- Reports

---

# 🧪 Testing

Backend APIs were tested using **Postman**.

Frontend was tested by integrating with the deployed backend.

---

# 🎯 Learning Outcomes

This project helped me learn:

- REST API Development
- Authentication using JWT
- Google OAuth
- MongoDB Relationships
- MERN Architecture
- React Hooks
- React Query
- Protected Routes
- State Management
- File Uploads
- Cloudinary Integration
- Payment Integration
- API Design
- Deployment using Vercel & Render

---

# 🚀 Future Improvements

- Real-time Chat
- Socket.IO Notifications
- Recommendation System
- AI Search
- Admin Analytics Dashboard
- Mobile Application
- Dark Mode
- Advanced Search Filters

---

# 👨‍💻 Author

**Siddharth**

Computer Science Undergraduate

**GitHub**

https://github.com/sx1ddu

**LinkedIn**

https://linkedin.com/in/siddharth-kandela-257384333

---

# 📄 License

This project is licensed under the MIT License.
