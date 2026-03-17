import { Schema, model } from 'mongoose';
import { TCoupon } from './coupon.interface';

const couponSchema = new Schema<TCoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['fixed', 'percentage'],
      required: [true, 'Coupon type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Coupon value is required'],
    },

    minOrder: {
      type: Number,
    },
    maxDiscount: {
      type: Number,
    },

    limit: {
      type: Number,
    },
    uses: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    scope: {
      type: String,
      enum: ['all', 'specific'],
      default: 'all',
    },
    productIds: [{ type: String }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Coupon = model<TCoupon>('Coupon', couponSchema);
