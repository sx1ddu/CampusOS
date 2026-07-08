// Seed script - fills the database with a realistic, interconnected set of
// demo data so the app looks like it already has active student users.
//
// Run with: npm run seed
//
// This only uses fields that already exist on the Mongoose models - it
// doesn't add anything new to the schema. It clears existing data first,
// so it's safe to run more than once.

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Resource from '../models/Resource.js';
import Booking from '../models/Booking.js';
import RentalBooking from '../models/RentalBooking.js';
import Review from '../models/Review.js';
import Favorite from '../models/Favorite.js';
import Report from '../models/Report.js';
import Notification from '../models/Notification.js';
import ReputationLog from '../models/ReputationLog.js';
import Payment from '../models/Payment.js';
import { BOOKING_STATUS, RENTAL_STATUS, PAYMENT_STATUS, NOTIFICATION_TYPES, REPORT_TYPES } from '../constants/enums.js';

const SEED_PASSWORD = 'Password123';

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[randomInt(0, arr.length - 1)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const round1 = (num) => Math.round(num * 10) / 10;

// Picks `count` unique random items from an array (no repeats).
const randomSample = (arr, count) => shuffle(arr).slice(0, Math.min(count, arr.length));

// A Date some number of days in the past, so records don't all look like
// they were created in the same second.
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const randomPastDate = (maxDaysAgo) => daysAgo(randomInt(0, maxDaysAgo));

// ---------------------------------------------------------------------------
// Static data pools (realistic Indian student names, colleges, etc.)
// ---------------------------------------------------------------------------
const FIRST_NAMES = [
  'Aarav', 'Rohit', 'Sai', 'Ananya', 'Rahul', 'Harsh', 'Sneha', 'Akash', 'Krishna', 'Aditya',
  'Priya', 'Vikram', 'Neha', 'Arjun', 'Kavya', 'Siddharth', 'Divya', 'Karthik', 'Pooja', 'Rajesh',
  'Meera', 'Varun', 'Ishita', 'Nikhil', 'Swati', 'Abhishek', 'Riya', 'Manish', 'Deepika', 'Yash',
  'Shreya', 'Ravi', 'Anjali', 'Suresh', 'Kirti', 'Gaurav', 'Simran', 'Tarun', 'Nisha', 'Vishal',
];

const LAST_NAMES = [
  'Sharma', 'Kumar', 'Teja', 'Patel', 'Reddy', 'Verma', 'Gupta', 'Singh', 'Nair', 'Rao',
  'Iyer', 'Mehta', 'Joshi', 'Chatterjee', 'Bose', 'Pillai', 'Menon', 'Desai', 'Agarwal', 'Kapoor',
  'Malhotra', 'Bhatt', 'Chauhan', 'Yadav', 'Naidu', 'Pandey', 'Mishra', 'Saxena', 'Trivedi', 'Kaur',
];

const COLLEGES = [
  'IIITDM Jabalpur', 'IIIT Hyderabad', 'NIT Warangal', 'NIT Trichy',
  'BITS Pilani', 'VIT Vellore', 'IIT Hyderabad', 'IIT Madras',
];

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering',
];

const SKILLS_POOL = [
  'javascript', 'react', 'node.js', 'python', 'mongodb', 'express', 'java', 'c++', 'dsa',
  'ui design', 'figma', 'canva', 'photography', 'video editing', 'public speaking',
  'content writing', 'excel', 'data analysis', 'machine learning', 'sql',
];

const BIO_TEMPLATES = [
  'Final-year student who loves turning side projects into real products.',
  'Passionate about web development and always up for a new freelance gig.',
  'Design enthusiast helping fellow students with posters, logos, and decks.',
  'I tutor juniors in DSA and enjoy explaining tricky concepts simply.',
  'Photography is my escape - also happy to shoot events on campus.',
  'Full-stack developer who ships fast and communicates faster.',
  'Runs a small campus rental service for gadgets and sports gear.',
  'Content writer by night, engineering student by day.',
  'Building my portfolio one freelance project at a time.',
  'Enjoys video editing and creating reels for campus clubs.',
  'Data enthusiast who loves Python, spreadsheets, and clean charts.',
  'Reliable, on-time, and always up for a new challenge.',
];

const SERVICE_CATEGORY_NAMES = [
  'Web Development', 'Design & Creatives', 'Tutoring & Mentoring',
  'Writing & Content', 'Photography & Video', 'Data & AI',
];
const RESOURCE_CATEGORY_NAMES = ['Electronics', 'Books & Stationery', 'Sports Equipment', 'Event Essentials'];

const SERVICE_TITLES = [
  'React Website Development', 'Node.js Backend Development', 'Portfolio Website', 'Graphic Design',
  'Resume Review', 'Video Editing', 'Photography', 'Assignment Help', 'Python Tutoring',
  'DSA Mentoring', 'UI Design', 'Logo Design', 'MongoDB Database Design', 'Presentation Design',
];

const SERVICE_TITLE_SUFFIXES = ['', '', '', ' - Fast Delivery', ' for Beginners', ' - Affordable Package', ' (Premium)'];

const SERVICE_DESCRIPTIONS = [
  "I'll work closely with you to deliver clean, high-quality results on time.",
  "Affordable and reliable - I've helped several students with this already.",
  'Quick turnaround with unlimited revisions until you are happy with the result.',
  'I focus on simple, practical solutions that actually get the job done.',
  'Freelanced on similar projects before, happy to share past work as samples.',
  'Flexible with timings and open to discussing your exact requirements first.',
  'I explain everything clearly so you understand, not just receive a finished file.',
  'Budget-friendly rates for fellow students, with premium quality output.',
  'Available on weekends and evenings for calls or in-person meetups on campus.',
  'I take a limited number of projects at a time to ensure quality.',
];

const RESOURCE_TITLES = [
  'DSLR Camera', 'Laptop', 'Monitor', 'Scientific Calculator', 'Football',
  'Cricket Kit', 'Books', 'Cycle', 'Tripod', 'Projector',
];

const RESOURCE_DESCRIPTIONS = [
  'Well-maintained and in great working condition.',
  'Barely used, available for short or long-term rent.',
  'Comes with all original accessories and a carry case.',
  'Perfect for short-term use during exams or events.',
  'Available for pickup near the hostel block, flexible timings.',
  'Clean and ready to use, deposit required for safety.',
];

const FIVE_STAR_COMMENTS = [
  'Excellent work, exceeded my expectations!',
  'Delivered before the deadline, highly recommend.',
  'Extremely professional and easy to work with.',
  'Best experience I have had on this platform.',
  'Went above and beyond, will book again.',
];
const FOUR_STAR_COMMENTS = [
  'Very professional and responsive throughout.',
  'Great quality work, minor delay in delivery.',
  'Highly recommended, would use again.',
  'Solid work overall, communicated well.',
];
const THREE_STAR_COMMENTS = [
  'Good communication, decent quality.',
  'Did the job, nothing extraordinary.',
  'Average experience, met basic expectations.',
];
const LOW_STAR_COMMENTS = [
  'Delivery was late and communication was slow.',
  'Not quite what I expected, needed a couple of revisions.',
];

// Weighted so most reviews skew positive, like a real marketplace.
const RATING_POOL = [5, 5, 5, 5, 4, 4, 4, 3, 3, 2];
const commentForRating = (rating) => {
  if (rating === 5) return randomChoice(FIVE_STAR_COMMENTS);
  if (rating === 4) return randomChoice(FOUR_STAR_COMMENTS);
  if (rating === 3) return randomChoice(THREE_STAR_COMMENTS);
  return randomChoice(LOW_STAR_COMMENTS);
};

const REPORT_REASONS = ['Spam Listing', 'Fake Service', 'Inappropriate Content', 'Harassment', 'Duplicate Listing'];

// ---------------------------------------------------------------------------
// Main seeding logic
// ---------------------------------------------------------------------------
const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  // Clear old data first so re-running this script doesn't create duplicates.
  await Promise.all([
    User.deleteMany(),
    Profile.deleteMany(),
    Category.deleteMany(),
    Service.deleteMany(),
    Resource.deleteMany(),
    Booking.deleteMany(),
    RentalBooking.deleteMany(),
    Review.deleteMany(),
    Favorite.deleteMany(),
    Report.deleteMany(),
    Notification.deleteMany(),
    ReputationLog.deleteMany(),
    Payment.deleteMany(),
  ]);
  console.log('Cleared existing data.');

  // --- Categories ---
  const serviceCategories = await Category.insertMany(
    SERVICE_CATEGORY_NAMES.map((name) => ({ name, type: 'service' }))
  );
  const resourceCategories = await Category.insertMany(
    RESOURCE_CATEGORY_NAMES.map((name) => ({ name, type: 'resource' }))
  );
  console.log(`Created ${serviceCategories.length + resourceCategories.length} categories.`);

  // --- Users + Profiles ---
  // NOTE: pass the PLAIN password - the User model's pre('save') hook
  // hashes it automatically, so hashing it here too would hash it twice
  // and nobody could log in.
  const users = [];
  const USER_COUNT = 40;

  for (let i = 0; i < USER_COUNT; i++) {
    const firstName = randomChoice(FIRST_NAMES);
    const lastName = randomChoice(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@campusos-demo.edu`;

    const user = await User.create({
      name,
      email,
      password: SEED_PASSWORD,
      isEmailVerified: true,
      role: i === 0 ? 'admin' : 'student', // one admin account for testing admin-only routes
      avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      createdAt: randomPastDate(180),
    });

    await Profile.create({
      user: user._id,
      bio: randomChoice(BIO_TEMPLATES),
      college: randomChoice(COLLEGES),
      department: randomChoice(DEPARTMENTS),
      year: randomInt(1, 5),
      skills: randomSample(SKILLS_POOL, randomInt(2, 5)),
      portfolioLinks: Math.random() < 0.5 ? [`https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`] : [],
    });

    users.push(user);
  }
  console.log(`Created ${users.length} users + profiles (admin: ${users[0].email}).`);

  // --- Services ---
  const services = [];
  const SERVICE_COUNT = 60;

  for (let i = 0; i < SERVICE_COUNT; i++) {
    const provider = randomChoice(users);
    const category = randomChoice(serviceCategories);
    const title = randomChoice(SERVICE_TITLES) + randomChoice(SERVICE_TITLE_SUFFIXES);

    const service = await Service.create({
      title,
      description: randomChoice(SERVICE_DESCRIPTIONS),
      category: category._id,
      provider: provider._id,
      price: randomInt(2, 60) * 50, // round-ish prices like 300, 750, 1500
      deliveryTimeDays: randomInt(1, 10),
      tags: randomSample(SKILLS_POOL, randomInt(2, 4)),
      images: [`https://picsum.photos/seed/service${i}/600/400`],
      status: Math.random() < 0.9 ? 'active' : 'inactive',
      createdAt: randomPastDate(90),
    });

    services.push(service);
  }
  console.log(`Created ${services.length} services.`);

  // --- Resources ---
  const resources = [];
  const RESOURCE_COUNT = 30;

  for (let i = 0; i < RESOURCE_COUNT; i++) {
    const owner = randomChoice(users);
    const category = randomChoice(resourceCategories);

    const resource = await Resource.create({
      title: randomChoice(RESOURCE_TITLES),
      description: randomChoice(RESOURCE_DESCRIPTIONS),
      category: category._id,
      owner: owner._id,
      rentPerDay: randomInt(2, 40) * 10, // 20 - 400
      depositAmount: randomInt(1, 10) * 100,
      images: [`https://picsum.photos/seed/resource${i}/600/400`],
      isAvailable: Math.random() < 0.85,
      createdAt: randomPastDate(90),
    });

    resources.push(resource);
  }
  console.log(`Created ${resources.length} resources.`);

  // --- Bookings ---
  // Build a fixed-proportion list of statuses first (40 completed, 16
  // accepted, 12 pending, 8 cancelled, 4 rejected = 80) then shuffle it,
  // so the mix is realistic and the exact counts are predictable.
  const bookingStatuses = shuffle([
    ...Array(40).fill(BOOKING_STATUS.COMPLETED),
    ...Array(16).fill(BOOKING_STATUS.ACCEPTED),
    ...Array(12).fill(BOOKING_STATUS.PENDING),
    ...Array(8).fill(BOOKING_STATUS.CANCELLED),
    ...Array(4).fill(BOOKING_STATUS.REJECTED),
  ]);

  const bookings = [];

  for (let i = 0; i < bookingStatuses.length; i++) {
    const service = randomChoice(services);

    // A user can never book their own service.
    let client = randomChoice(users);
    while (client._id.equals(service.provider)) {
      client = randomChoice(users);
    }

    const status = bookingStatuses[i];
    const booking = await Booking.create({
      service: service._id,
      client: client._id,
      provider: service.provider,
      amount: service.price,
      status,
      scheduledDate: randomPastDate(45),
      isPaid: status === BOOKING_STATUS.COMPLETED && Math.random() < 0.7,
      createdAt: randomPastDate(60),
    });

    // Keep the extra context we'll need later (service title, etc.)
    // without another database round trip.
    bookings.push({ ...booking.toObject(), serviceTitle: service.title });
  }
  console.log(`Created ${bookings.length} bookings.`);

  // --- Rental Bookings ---
  const rentalStatuses = shuffle([
    ...Array(10).fill(RENTAL_STATUS.RETURNED),
    ...Array(5).fill(RENTAL_STATUS.COMPLETED),
    ...Array(6).fill(RENTAL_STATUS.APPROVED),
    ...Array(6).fill(RENTAL_STATUS.PENDING),
    ...Array(3).fill(RENTAL_STATUS.REJECTED),
  ]);

  const rentals = [];

  for (let i = 0; i < rentalStatuses.length; i++) {
    const resource = randomChoice(resources);

    // A user can never rent their own resource.
    let renter = randomChoice(users);
    while (renter._id.equals(resource.owner)) {
      renter = randomChoice(users);
    }

    const fromDate = randomPastDate(45);
    const days = randomInt(1, 7);
    const toDate = new Date(fromDate.getTime() + days * 24 * 60 * 60 * 1000);
    const status = rentalStatuses[i];

    const rental = await RentalBooking.create({
      resource: resource._id,
      renter: renter._id,
      owner: resource.owner,
      fromDate,
      toDate,
      amount: days * resource.rentPerDay,
      depositAmount: resource.depositAmount,
      status,
      isPaid: [RENTAL_STATUS.RETURNED, RENTAL_STATUS.COMPLETED].includes(status) && Math.random() < 0.7,
      createdAt: fromDate,
    });

    rentals.push({ ...rental.toObject(), resourceTitle: resource.title });
  }
  console.log(`Created ${rentals.length} rental bookings.`);

  // --- Reviews ---
  // A review can only exist for a completed booking / returned or completed
  // rental, and each side (client/provider or renter/owner) can leave at
  // most one review for that transaction. We build every valid "slot",
  // shuffle them, and take the first 80.
  const reviewSlots = [];

  bookings
    .filter((b) => b.status === BOOKING_STATUS.COMPLETED)
    .forEach((b) => {
      reviewSlots.push({ reviewType: 'booking', bookingId: b._id, reviewer: b.client, receiver: b.provider, service: b.service });
      reviewSlots.push({ reviewType: 'booking', bookingId: b._id, reviewer: b.provider, receiver: b.client, service: b.service });
    });

  rentals
    .filter((r) => [RENTAL_STATUS.RETURNED, RENTAL_STATUS.COMPLETED].includes(r.status))
    .forEach((r) => {
      reviewSlots.push({ reviewType: 'rental', bookingId: r._id, reviewer: r.renter, receiver: r.owner });
      reviewSlots.push({ reviewType: 'rental', bookingId: r._id, reviewer: r.owner, receiver: r.renter });
    });

  const chosenSlots = shuffle(reviewSlots).slice(0, 80);
  const reviews = [];

  for (const slot of chosenSlots) {
    const rating = randomChoice(RATING_POOL);
    const review = await Review.create({
      reviewType: slot.reviewType,
      bookingId: slot.bookingId,
      reviewer: slot.reviewer,
      receiver: slot.receiver,
      rating,
      comment: commentForRating(rating),
      createdAt: randomPastDate(30),
    });
    reviews.push({ ...review.toObject(), service: slot.service });
  }
  console.log(`Created ${reviews.length} reviews.`);

  // --- Update Service and Profile rating stats to match the reviews above ---
  for (const service of services) {
    const serviceReviews = reviews.filter((r) => r.service && r.service.equals(service._id));
    if (serviceReviews.length > 0) {
      const avg = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
      const totalBookings = bookings.filter(
        (b) => b.service.equals(service._id) && b.status === BOOKING_STATUS.COMPLETED
      ).length;
      await Service.findByIdAndUpdate(service._id, {
        avgRating: round1(avg),
        totalReviews: serviceReviews.length,
        totalBookings,
      });
    }
  }

  for (const user of users) {
    const receivedReviews = reviews.filter((r) => r.receiver.equals(user._id));
    const completedAsProvider = bookings.filter(
      (b) => b.provider.equals(user._id) && b.status === BOOKING_STATUS.COMPLETED
    ).length;
    const completedAsOwner = rentals.filter(
      (r) => r.owner.equals(user._id) && [RENTAL_STATUS.RETURNED, RENTAL_STATUS.COMPLETED].includes(r.status)
    ).length;

    const profileUpdate = { completedBookings: completedAsProvider + completedAsOwner };
    if (receivedReviews.length > 0) {
      profileUpdate.avgRating = round1(receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length);
    }
    await Profile.findOneAndUpdate({ user: user._id }, profileUpdate);
  }
  console.log('Updated service ratings and profile stats.');

  // --- Payments ---
  // Pick from bookings/rentals that are already confirmed (accepted or
  // further along) - you wouldn't pay for something still pending.
  const payableBookings = bookings.filter((b) => [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.COMPLETED].includes(b.status));
  const payableRentals = rentals.filter((r) =>
    [RENTAL_STATUS.APPROVED, RENTAL_STATUS.RETURNED, RENTAL_STATUS.COMPLETED].includes(r.status)
  );
  const paymentCandidates = shuffle([
    ...payableBookings.map((b) => ({ type: 'booking', doc: b })),
    ...payableRentals.map((r) => ({ type: 'rental', doc: r })),
  ]).slice(0, 30);

  const payments = [];

  for (let i = 0; i < paymentCandidates.length; i++) {
    const { type, doc } = paymentCandidates[i];

    const payment = await Payment.create({
      user: type === 'booking' ? doc.client : doc.renter,
      bookingId: type === 'booking' ? doc._id : undefined,
      rentalId: type === 'rental' ? doc._id : undefined,
      razorpayOrderId: `order_seed_${String(i + 1).padStart(4, '0')}`,
      razorpayPaymentId: `pay_seed_${String(i + 1).padStart(4, '0')}`,
      amount: doc.amount,
      status: PAYMENT_STATUS.PAID,
      createdAt: randomPastDate(30),
    });
    payments.push(payment);

    // Keep the booking/rental's isPaid flag consistent with having a paid payment.
    if (type === 'booking') {
      await Booking.findByIdAndUpdate(doc._id, { isPaid: true });
    } else {
      await RentalBooking.findByIdAndUpdate(doc._id, { isPaid: true });
    }
  }
  console.log(`Created ${payments.length} payments.`);

  // --- Reputation Logs ---
  // Mirrors what the real app does in bookingController/reviewController:
  // completing a booking/rental and receiving a good review both earn points.
  const reputationCandidates = [];

  bookings
    .filter((b) => b.status === BOOKING_STATUS.COMPLETED)
    .forEach((b) => reputationCandidates.push({ user: b.provider, points: 10, reason: 'Completed a booking' }));

  rentals
    .filter((r) => [RENTAL_STATUS.RETURNED, RENTAL_STATUS.COMPLETED].includes(r.status))
    .forEach((r) => reputationCandidates.push({ user: r.owner, points: 8, reason: 'Completed a rental' }));

  reviews
    .filter((r) => r.rating >= 4)
    .forEach((r) => reputationCandidates.push({ user: r.receiver, points: 5, reason: 'Received a positive review' }));

  const chosenReputationLogs = shuffle(reputationCandidates).slice(0, 80);

  await ReputationLog.insertMany(
    chosenReputationLogs.map((log) => ({ ...log, createdAt: randomPastDate(60) }))
  );

  // Roll the chosen logs up into each user's Profile.reputationScore.
  const scoreByUser = {};
  chosenReputationLogs.forEach((log) => {
    const key = log.user.toString();
    scoreByUser[key] = (scoreByUser[key] || 0) + log.points;
  });
  await Promise.all(
    Object.entries(scoreByUser).map(([userId, score]) =>
      Profile.findOneAndUpdate({ user: userId }, { reputationScore: score })
    )
  );
  console.log(`Created ${chosenReputationLogs.length} reputation logs.`);

  // --- Favorites ---
  const favoriteItems = [
    ...services.map((s) => ({ itemType: 'service', itemId: s._id })),
    ...resources.map((r) => ({ itemType: 'resource', itemId: r._id })),
  ];

  const favoriteKeys = new Set();
  const favoriteDocs = [];
  let attempts = 0;

  while (favoriteDocs.length < 100 && attempts < 1000) {
    attempts++;
    const user = randomChoice(users);
    const item = randomChoice(favoriteItems);
    const key = `${user._id}-${item.itemType}-${item.itemId}`;

    if (favoriteKeys.has(key)) continue; // matches the unique index - skip duplicates
    favoriteKeys.add(key);

    favoriteDocs.push({
      user: user._id,
      itemType: item.itemType,
      itemId: item.itemId,
      createdAt: randomPastDate(60),
    });
  }

  await Favorite.insertMany(favoriteDocs);
  console.log(`Created ${favoriteDocs.length} favorites.`);

  // --- Reports ---
  const reportDocs = [];
  for (let i = 0; i < 20; i++) {
    const targetType = randomChoice(Object.values(REPORT_TYPES));
    let targetId;
    if (targetType === 'service') targetId = randomChoice(services)._id;
    else if (targetType === 'resource') targetId = randomChoice(resources)._id;
    else targetId = randomChoice(users)._id;

    reportDocs.push({
      reporter: randomChoice(users)._id,
      targetType,
      targetId,
      reason: randomChoice(REPORT_REASONS),
      status: Math.random() < 0.3 ? 'resolved' : 'open',
      createdAt: randomPastDate(45),
    });
  }
  const reports = await Report.insertMany(reportDocs);
  console.log(`Created ${reports.length} reports.`);

  // --- Notifications ---
  // Built from the real events above, so they read naturally (e.g. a
  // booking that was accepted actually notifies that booking's client).
  const notificationCandidates = [];

  bookings
    .filter((b) => b.status !== BOOKING_STATUS.PENDING)
    .forEach((b) => {
      const notifyTarget = b.status === BOOKING_STATUS.CANCELLED ? b.provider : b.client;
      notificationCandidates.push({
        user: notifyTarget,
        type: NOTIFICATION_TYPES.BOOKING_UPDATE,
        message: `Your booking for "${b.serviceTitle}" is now "${b.status}"`,
      });
    });

  rentals
    .filter((r) => r.status !== RENTAL_STATUS.PENDING)
    .forEach((r) => {
      notificationCandidates.push({
        user: r.renter,
        type: NOTIFICATION_TYPES.RENTAL_UPDATE,
        message: `Your rental of "${r.resourceTitle}" is now "${r.status}"`,
      });
    });

  reviews.forEach((r) => {
    notificationCandidates.push({
      user: r.receiver,
      type: NOTIFICATION_TYPES.NEW_REVIEW,
      message: `You received a ${r.rating}-star review`,
    });
  });

  payments.forEach((p) => {
    notificationCandidates.push({
      user: p.user,
      type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
      message: 'Your payment was successful',
    });
  });

  reports
    .filter((r) => r.status === 'resolved')
    .forEach((r) => {
      notificationCandidates.push({
        user: r.reporter,
        type: NOTIFICATION_TYPES.REPORT_UPDATE,
        message: 'Your report has been resolved',
      });
    });

  const chosenNotifications = shuffle(notificationCandidates)
    .slice(0, 120)
    .map((n) => ({ ...n, isRead: Math.random() < 0.5, createdAt: randomPastDate(30) }));

  await Notification.insertMany(chosenNotifications);
  console.log(`Created ${chosenNotifications.length} notifications.`);

  // --- Done ---
  console.log('\nSeed complete!');
  console.log(`All ${users.length} users share the password: ${SEED_PASSWORD}`);
  console.log(`Admin login: ${users[0].email} / ${SEED_PASSWORD}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});