# 🎓 CampusOS Backend

A backend REST API for a campus marketplace where students can offer services, rent out items to each other, book and pay for things, and build a reputation on their campus.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.4-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#license)

---

## 🚀 Live Demo

The backend is deployed and live on Render.

**Backend API:** [https://campusos-39xt.onrender.com](https://campusos-39xt.onrender.com)

**Health Check:** [https://campusos-39xt.onrender.com/api/health](https://campusos-39xt.onrender.com/api/health)

You can test all the API routes using Postman by sending requests to the live URL above. Note: since this is hosted on Render's free tier, the first request after some time may take 30-50 seconds to respond while the server wakes up.

---

## 📌 About the Project

CampusOS is a marketplace built only for students. Instead of using random WhatsApp groups or Facebook posts to find help or rent items on campus, students can use CampusOS to:

- Offer a skill as a paid service (like tutoring, design, or resume review)
- Rent out an item they own (like a calculator, camera, or book)
- Book a service or rent an item from another student
- Pay securely using Razorpay
- Leave a review after the booking is done
- Build a reputation score based on completed bookings and reviews

This project was built to practice real backend development skills such as authentication, file uploads, payments, and working with MongoDB relationships, using a project structure similar to what real companies use.

---

## ✨ Features

**Authentication**
- Register and login with email + password
- Email verification link sent using Nodemailer
- Login with Google (Google OAuth)
- JWT access token + refresh token
- Forgot password and reset password via email
- Logout

**Profile**
- View and update your profile (bio, college, skills, etc.)
- Upload a profile picture (stored on Cloudinary)
- View another user's public profile

**Service Marketplace**
- Create, update, and delete a service listing
- Upload images for a service
- Search and filter services by category and price
- View your own listed services

**Resource Rental**
- List an item for rent
- Search and filter items by category
- Prevents double-booking the same item for the same dates

**Bookings & Rentals**
- Request to book a service or rent an item
- Accept / reject / complete a booking
- Approve / mark a rental as returned

**Payments**
- Create a Razorpay order for a booking or rental
- Verify payment using Razorpay's signature check

**Reviews & Reputation**
- Leave a rating and comment after a completed booking
- Average rating is updated automatically
- Reputation points are tracked for each user

**Other Features**
- Favorites (save a service/resource for later)
- Report a service, resource, or user
- Admin-only routes to view and resolve reports
- In-app notifications (auto-deleted after 30 days)
- Role-based access (student / admin)
- Centralized error handling and consistent API responses

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, Google OAuth, bcrypt |
| Payments | Razorpay |
| File Storage | Cloudinary + Multer |
| Email | Nodemailer |
| Validation | express-validator |
| Deployment | Render |

---

## 📂 Folder Structure

```
src/
├── config/          # MongoDB and Cloudinary setup
├── constants/       # Fixed values like roles, statuses, HTTP codes
├── models/          # Mongoose schemas (User, Service, Booking, etc.)
├── middleware/      # Auth check, error handler, file upload, validation
├── controllers/     # Business logic for each feature
├── routes/          # API endpoints, mapped to controllers
├── services/        # Helper logic (email, payment, reputation)
├── utils/           # Small reusable helpers (ApiError, ApiResponse, etc.)
├── seed/            # Script to fill the database with demo data
├── app.js           # Express app setup (middleware + routes)
└── server.js         # Starts the server after connecting to MongoDB
```

---

## ⚙️ Installation Steps

**1. Clone the repository**
```bash
git clone https://github.com/sx1ddu/CampusOS
cd server
```

**2. Install dependencies**
```bash
npm install
```

**3. Create a `.env` file** in the root folder and add the environment variables listed below.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port number for the server |
| `MONGO_URI` | Your MongoDB connection string |
| `CLIENT_URL` | Frontend URL (used for CORS and email links) |
| `JWT_ACCESS_SECRET` | Secret key for signing access tokens |
| `JWT_ACCESS_EXPIRY` | Access token expiry (e.g. `15m`) |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry (e.g. `7d`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `EMAIL_HOST` | SMTP host for sending emails |
| `EMAIL_PORT` | SMTP port |
| `EMAIL_USER` | Email account used to send emails |
| `EMAIL_PASS` | Email account password / app password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |



---

## ▶️ Running the Project Locally

Make sure MongoDB is running (locally or using a free MongoDB Atlas cluster), then start the server:

```bash
npm run dev
```

The server will start at `http://localhost:5000` (or the port you set). You can check if it's working by opening:

```
http://localhost:5000/api/health
```

---

## 🌱 Database Seeding

To quickly fill your database with demo data (users, categories, services, and resources), run:

```bash
npm run seed
```

This creates 20 demo student accounts (all using the same password, shown in the terminal after seeding), along with sample service and resource listings, so you have data to test with right away.

---

## 🔗 API Overview

All routes are prefixed with `/api`. Below are the main route groups (not every single endpoint):

| Route Group | What it does |
|---|---|
| `/api/auth` | Register, login, Google login, email verification, refresh token, logout, forgot/reset password |
| `/api/users` | View/update profile, upload avatar |
| `/api/categories` | View categories, create category (admin only) |
| `/api/services` | Browse, search, create, update, delete service listings |
| `/api/bookings` | Book a service, view your bookings, update booking status |
| `/api/resources` | Browse, search, create, update, delete rental items |
| `/api/rentals` | Rent a resource, view your rentals, update rental status |
| `/api/reviews` | Leave a review, view reviews for a user |
| `/api/favorites` | Add, view, remove favorites |
| `/api/reports` | Report an item/user, view/resolve reports (admin only) |
| `/api/notifications` | View notifications, mark as read |
| `/api/payments` | Create a payment order, verify payment |

---

## ☁️ Deployment

This backend is deployed on **[Render](https://render.com/)** as a web service.

- Build command: `npm install`
- Start command: `npm start`
- MongoDB is hosted on **MongoDB Atlas** (a free cloud database)
- All environment variables are added in Render's dashboard under **Environment**

🔗 **Live Backend:** [https://campusos-39xt.onrender.com](https://campusos-39xt.onrender.com)

---

## 🧪 Testing with Postman

You can test every route using **Postman**:

1. Open Postman and create a new request.
2. Use the live URL (`https://campusos-39xt.onrender.com/api/...`) or your local URL (`http://localhost:5000/api/...`).
3. For protected routes, log in first using `/api/auth/login` to get an `accessToken`, then add it to the request header:
   ```
   Authorization: Bearer <your_access_token>
   ```
4. For routes that need image uploads (like creating a service), use Postman's `form-data` body type instead of JSON.
5. Start with `GET /api/health` to make sure the server is reachable before testing other routes.

---

## 🔮 Future Improvements

- Real-time chat between students using Socket.IO
- Rate limiting on login/register to prevent brute-force attempts
- Redis caching for frequently viewed data
- Better search using a dedicated search engine
- Admin dashboard with basic analytics

---

## 👨‍💻 Author

**Siddharth**
Computer Science Undergraduate

- GitHub: [sx1ddu](https://github.com/sx1ddu)
- LinkedIn: [siddharth-kandela-257384333](https://linkedin.com/in/siddharth-kandela-257384333)
- 

---

## 📄 License

This project is licensed under the MIT License.
