import { z } from 'zod';

// create
const createCouponValidationSchema = z.object({
  body: z.object({
    code: z.string({
      required_error: 'Coupon code is required',
    }),

    type: z.enum(['fixed', 'percentage'], {
      required_error: 'Coupon type is required',
    }),

    value: z.number({
      required_error: 'Coupon value is required',
    }),

    minOrder: z.number().optional(),
    maxDiscount: z.number().optional(),

    limit: z.number().optional(),
    uses: z.number().optional(),

    expiresAt: z.string().optional(),

    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),

    scope: z.enum(['all', 'specific'], {
      required_error: 'Coupon scope is required',
    }),

    productIds: z.array(z.string()).optional(),
  }),
});

// update (separate)
const updateCouponValidationSchema = z.object({
  body: z.object({
    code: z.string().optional(),
    type: z.enum(['fixed', 'percentage']).optional(),
    value: z.number().optional(),

    minOrder: z.number().optional(),
    maxDiscount: z.number().optional(),

    limit: z.number().optional(),
    uses: z.number().optional(),

    expiresAt: z.string().optional(),

    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),

    scope: z.enum(['all', 'specific']).optional(),

    productIds: z.array(z.string()).optional(),
  }),
});

export const CouponValidations = {
  createCouponValidationSchema,
  updateCouponValidationSchema,
};
