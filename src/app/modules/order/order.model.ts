import { Schema, model } from 'mongoose';
import { ORDER_STATUS } from './order.constants';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true, // optional but ideal
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    fullAddress: {
      type: String,
      required: [true, 'Full address is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    orderNotes: {
      type: String,
      required: false,
    },
    shippingOption: {
      type: String,
      enum: ['dhaka', 'outside'],
      required: [true, 'Shipping zone (inside Dhaka or not) must be specified'],
    },
    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product reference is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
      },
    ],
    subtotal: {
      type: Number,
      required: false,
      min: [0, 'Total price cannot be negative'],
    },
    shippingCost: {
      type: Number,
      required: false,
      default: 0,
    },
    total: {
      type: Number,
      required: false,
      min: [0, 'Sub total price cannot be negative'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.pending,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model<IOrder>('Order', orderSchema);
