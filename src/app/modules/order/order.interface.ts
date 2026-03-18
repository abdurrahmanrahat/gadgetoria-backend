import { Document, Types } from 'mongoose';
import { ORDER_STATUS } from './order.constants';

export interface IOrder extends Document {
  orderNumber: string;
  fullName: string;
  fullAddress: string;
  phone: string;
  country: string;
  orderNotes?: string;
  shippingOption: 'dhaka' | 'outside';
  orderItems: TOrderItem[];
  total?: number;
  subtotal?: number;
  paymentMethod: string;
  shippingCost?: number;
  discountCouponCode?: string;
  discountAmount?: number;
  status?: keyof typeof ORDER_STATUS;
  isDeleted?: boolean;
}

type TOrderItem = {
  product: Types.ObjectId;
  quantity: number;
};

// after creating order, then update each product stock
