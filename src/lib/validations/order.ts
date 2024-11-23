import * as z from 'zod';

export const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
  addons: z.array(z.object({
    name: z.string(),
    price: z.number().positive(),
  })).optional(),
});

export const deliveryInfoSchema = z.object({
  address: z.string().min(10, 'Address must be at least 10 characters'),
  contact: z.string().regex(/^(09|\+639)\d{9}$/, 'Invalid phone number format'),
  instructions: z.string().optional(),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  total: z.number().positive(),
  paymentMethod: z.enum(['gcash', 'cod']),
  deliveryInfo: deliveryInfoSchema,
});

export const orderUpdateSchema = z.object({
  orderStatus: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
  paymentStatus: z.enum(['pending', 'processing', 'paid', 'failed']),
});
