// src/validations/registerSchema.ts
import { z } from 'zod';

export const step1Schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
});

export const step2Schema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const step3Schema = z.object({
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms' }),
  }),
});
