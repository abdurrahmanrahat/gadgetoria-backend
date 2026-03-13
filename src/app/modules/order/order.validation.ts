import { z } from 'zod';
import { ORDER_STATUS_VALUES } from './order.constants';

const orderItemSchema = z.object({
  product: z
    .string({ required_error: 'Product ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
  quantity: z
    .number({ required_error: 'Quantity is required' })
    .min(1, 'Quantity must be at least 1'),
});

const createOrderValidationSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(1, 'Full name cannot be empty')
      .trim(),
    fullAddress: z
      .string({ required_error: 'Full address is required' })
      .min(1, 'Full address cannot be empty')
      .trim(),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .min(6, 'Phone number must be valid'),
    country: z
      .string({ required_error: 'Country is required' })
      .min(1, 'Country cannot be empty'),
    orderNotes: z.string().optional(),
    shippingOption: z.enum(['dhaka', 'outside'], {
      required_error: 'Shipping option is required',
    }),
    orderItems: z
      .array(orderItemSchema)
      .min(1, 'At least one order item is required'),
    subtotal: z
      .number({ required_error: 'Subtotal price is required' })
      .min(0, 'Subtotal price must be non-negative')
      .optional(),
    total: z
      .number({ required_error: 'Total price is required' })
      .min(0, 'Total price must be non-negative')
      .optional(),
    paymentMethod: z
      .string({ required_error: 'Payment method is required' })
      .min(1, 'Payment method cannot be empty'),
  }),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).optional(),
    fullAddress: z.string().min(1).optional(),
    phone: z.string().min(6).optional(),
    country: z.string().min(1).optional(),
    orderNotes: z.string().optional(),
    shippingOption: z.enum(['dhaka', 'outside']).optional(),
    subtotal: z.number().optional(),
    total: z.number().optional(),
    paymentMethod: z.enum(['CASH-ON-DELIVERY', 'DIGITAL-PAYMENT']).optional(),
    status: z.enum(ORDER_STATUS_VALUES).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const OrderValidations = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
