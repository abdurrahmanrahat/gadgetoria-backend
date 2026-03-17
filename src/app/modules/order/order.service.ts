/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import {
  insideDhakaShippingCost,
  outsideDhakaShippingCost,
} from '../../utils/shippingKey';
import { Product } from '../product/product.model';
import { orderSearchableFields } from './order.constants';
import { IOrder } from './order.interface';
import { Order } from './order.model';

// const createOrderIntoDB = async (payload: IOrder) => {
//   const session = await Order.startSession();

//   try {
//     session.startTransaction();

//     // order number count
//     const now = new Date();
//     const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1)
//       .toString()
//       .padStart(2, '0')}`; // e.g., 202508

//     // Find the latest order for this month
//     const lastOrder = await Order.findOne({
//       isDeleted: false,
//       orderNumber: new RegExp(`ORD-${yearMonth}-`),
//     })
//       .sort({ createdAt: -1 })
//       .session(session)
//       .exec();

//     let sequence = 1;

//     if (lastOrder && lastOrder.orderNumber) {
//       // Extract last 6 digits for the sequence
//       const lastSeq = parseInt(lastOrder.orderNumber.slice(-6), 10);
//       sequence = lastSeq + 1;
//     }

//     const orderNumber = `ORD-${yearMonth}-${sequence
//       .toString()
//       .padStart(6, '0')}`;

//     for (const item of payload.orderItems) {
//       const updateResult = await Product.updateOne(
//         {
//           _id: item.product,
//           stock: { $gte: item.quantity }, // make sure enough stock remains
//         },
//         {
//           $inc: {
//             stock: -item.quantity, // deduct stock
//             salesCount: item.quantity, // increase sales count
//           },
//         },
//         { session },
//       );

//       if (updateResult.modifiedCount === 0) {
//         throw new AppError(
//           httpStatus.BAD_REQUEST,
//           `Insufficient stock for product ${item.product}`,
//         );
//       }
//     }

//     const createdOrder = await Order.create([{ ...payload, orderNumber }], {
//       session,
//     });

//     await session.commitTransaction();
//     session.endSession();

//     return createdOrder[0];
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();

//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       error.message || 'Unknown error',
//     );
//   }
// };

const createOrderIntoDB = async (payload: IOrder) => {
  const session = await Order.startSession();

  try {
    session.startTransaction();

    /* ================================
       Generate Order Number
    ================================= */
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    const lastOrder = await Order.findOne({
      isDeleted: false,
      orderNumber: new RegExp(`ORD-${yearMonth}-`),
    })
      .sort({ createdAt: -1 })
      .session(session)
      .exec();

    let sequence = 1;

    if (lastOrder?.orderNumber) {
      const lastSeq = parseInt(lastOrder.orderNumber.slice(-6), 10);
      sequence = lastSeq + 1;
    }

    const orderNumber = `ORD-${yearMonth}-${sequence
      .toString()
      .padStart(6, '0')}`;

    /* ================================
       Fetch Products From DB
    ================================= */
    const productIds = payload.orderItems.map((item) => item.product);

    const products = await Product.find({
      _id: { $in: productIds },
    }).session(session);

    /* ================================
       Calculate Prices Securely
    ================================= */
    let subtotal = 0;

    const secureOrderItems = payload.orderItems.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product.toString(),
      );

      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product not found: ${item.product}`,
        );
      }

      const itemTotal = product.sellingPrice * item.quantity;

      subtotal += itemTotal;

      return {
        product: product._id,
        quantity: item.quantity,
        price: product.sellingPrice,
      };
    });

    /* ================================
       Shipping Calculation
    ================================= */
    const shippingCost =
      payload.shippingOption === 'dhaka'
        ? insideDhakaShippingCost
        : outsideDhakaShippingCost;

    const total = subtotal + shippingCost;

    /* ================================
       Update Stock
    ================================= */
    for (const item of secureOrderItems) {
      const updateResult = await Product.updateOne(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: {
            stock: -item.quantity,
            salesCount: item.quantity,
          },
        },
        { session },
      );

      if (updateResult.modifiedCount === 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for product ${item.product}`,
        );
      }
    }

    /* ================================
       Create Order
    ================================= */
    const createdOrder = await Order.create(
      [
        {
          ...payload,
          orderItems: secureOrderItems,
          orderNumber,
          subtotal,
          shippingCost,
          total,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return createdOrder[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Unknown error',
    );
  }
};

const getOrdersFromDB = async (query: Record<string, unknown>) => {
  const baseQuery = Order.find({ isDeleted: false }).lean();

  const orderQuery = new QueryBuilder(baseQuery, query)
    .search(orderSearchableFields)
    .filter()
    .paginate()
    .sort();

  const countQuery = new QueryBuilder(baseQuery, query)
    .search(orderSearchableFields)
    .filter();

  const [data, totalCount] = await Promise.all([
    orderQuery.modelQuery
      .populate('orderItems.product')
      .sort({ createdAt: -1 }),

    countQuery.modelQuery.countDocuments(),
  ]);

  return { data, totalCount };
};

const getSingleOrderFromDB = async (orderId: string) => {
  const order = await Order.findOne({
    _id: orderId,
    isDeleted: false,
  }).populate('orderItems.product');

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found.');
  }

  return order;
};

const trackingOrderFromDB = async (orderNumber: string, phone: string) => {
  const order = await Order.findOne({
    orderNumber,
    phone,
    isDeleted: false,
  }).populate('orderItems.product');

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found.');
  }

  return order;
};

const updateOrderIntoDB = async (orderId: string, payload: Partial<IOrder>) => {
  const updatedOrder = await Order.findByIdAndUpdate(orderId, payload, {
    new: true,
  });

  if (!updatedOrder) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Order not found or already deleted.',
    );
  }

  return updatedOrder;
};

const deleteOrderIntoDB = async (orderId: string) => {
  const session = await Order.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne({
      _id: orderId,
      isDeleted: false,
    }).session(session);

    if (!order) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Order not found or already deleted.',
      );
    }

    for (const item of order.orderItems) {
      await Product.updateOne(
        { _id: item.product },
        {
          $inc: {
            stock: item.quantity,
            salesCount: -item.quantity,
          },
        },
        { session },
      );
    }

    order.isDeleted = true;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Internal server error!',
    );
  }
};

export const OrderServices = {
  createOrderIntoDB,
  getOrdersFromDB,
  getSingleOrderFromDB,
  trackingOrderFromDB,
  updateOrderIntoDB,
  deleteOrderIntoDB,
};
