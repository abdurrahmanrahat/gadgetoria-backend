export type TCoupon = {
  code: string;
  type: 'fixed' | 'percentage';
  value: number;

  minOrder?: number;
  maxDiscount?: number;

  limit?: number;
  uses?: number; // calculate when order

  expiresAt?: Date;
  isActive: boolean;

  scope: 'all' | 'specific';
  productIds?: string[];
  isDeleted: boolean;
};
