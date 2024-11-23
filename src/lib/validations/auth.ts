import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(09|\+639)\d{9}$/, 'Invalid phone number format'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword) {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
}).refine((data) => {
  if (data.newPassword) {
    return !!data.currentPassword;
  }
  return true;
}, {
  message: "Current password is required to set a new password",
  path: ["currentPassword"],
});
