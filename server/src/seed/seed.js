// Simple script to fill the database with demo data so the app has
// something to show right after cloning the repo. Not meant to be
// "realistic" in every detail - just enough to click around with.

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Resource from '../models/Resource.js';

const SEED_PASSWORD = 'Password123';

const COLLEGES = ['IIT Hyderabad', 'BITS Pilani', 'NIT Warangal', 'VIT Vellore'];

const SERVICE_CATEGORIES = ['Web Development', 'Graphic Design', 'Tutoring', 'Content Writing'];
const RESOURCE_CATEGORIES = ['Electronics', 'Books', 'Sports Equipment'];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  // Clear old data first so we don't get duplicates on re-run.
  await Promise.all([
    User.deleteMany(),
    Profile.deleteMany(),
    Category.deleteMany(),
    Service.deleteMany(),
    Resource.deleteMany(),
  ]);

  // --- Categories ---
  const serviceCategories = await Category.insertMany(
    SERVICE_CATEGORIES.map((name) => ({ name, type: 'service' }))
  );
  const resourceCategories = await Category.insertMany(
    RESOURCE_CATEGORIES.map((name) => ({ name, type: 'resource' }))
  );

  // --- Users + Profiles ---
  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);
  const users = [];

  for (let i = 1; i <= 20; i++) {
    const user = await User.create({
      name: `Student ${i}`,
      email: `student${i}@campusos-demo.edu`,
      password: hashedPassword,
      isEmailVerified: true,
    });
    await Profile.create({
      user: user._id,
      college: COLLEGES[i % COLLEGES.length],
      bio: 'Just a student trying to make some extra money on campus.',
      skills: ['javascript', 'communication'],
    });
    users.push(user);
  }

  // --- Services ---
  for (let i = 0; i < 20; i++) {
    const provider = users[Math.floor(Math.random() * users.length)];
    const category = serviceCategories[Math.floor(Math.random() * serviceCategories.length)];

    await Service.create({
      title: `${category.name} help #${i + 1}`,
      description: 'I can help you with this for a reasonable price.',
      category: category._id,
      provider: provider._id,
      price: 200 + Math.floor(Math.random() * 2000),
      deliveryTimeDays: 1 + Math.floor(Math.random() * 5),
    });
  }

  // --- Resources ---
  for (let i = 0; i < 10; i++) {
    const owner = users[Math.floor(Math.random() * users.length)];
    const category = resourceCategories[Math.floor(Math.random() * resourceCategories.length)];

    await Resource.create({
      title: `${category.name} item #${i + 1}`,
      description: 'Available for rent, good condition.',
      category: category._id,
      owner: owner._id,
      rentPerDay: 20 + Math.floor(Math.random() * 200),
      depositAmount: 500,
    });
  }

  console.log('Seed complete!');
  console.log(`Created ${users.length} users. All use the password: ${SEED_PASSWORD}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
