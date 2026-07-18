import { z } from 'zod'

// Each schema below matches the rules the backend already enforces
// (see the User/Service/Resource models) - validating on the frontend
// first just gives faster feedback, the backend still double-checks.

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    college: z.string().min(2, 'College is required'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const serviceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  deliveryTimeDays: z.coerce.number().min(1, 'Delivery time must be at least 1 day'),
  // Optional because the Create form doesn't show a status field -
  // only the Edit form does, once a service already exists.
  status: z.string().optional(),
})

export const resourceSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  rentPerDay: z.coerce.number().min(0, 'Rent cannot be negative'),
  depositAmount: z.coerce.number().min(0, 'Deposit cannot be negative').optional(),
})

export const profileSchema = z.object({
  bio: z.string().max(300, 'Bio cannot exceed 300 characters').optional(),
  college: z.string().optional(),
  department: z.string().optional(),
  year: z.coerce.number().min(1).max(5).optional(),
  // Comma-separated in the form (e.g. "React, Figma, Excel"), split into
  // an array before it's sent to the API - see ProfileSetupPage.
  skillsInput: z.string().optional(),
})

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1, 'Please select a rating').max(5),
  comment: z.string().max(500, 'Comment cannot exceed 500 characters').optional(),
})

export const reportSchema = z.object({
  reason: z.string().min(5, 'Please explain the reason'),
})
