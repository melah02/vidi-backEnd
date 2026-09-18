// controllers/order.ts
import type { Request, Response } from "express";
import sequelize from "../config/database.js";
import Cart from "../models/Cart.js";
import StoreProduct from "../models/StoreProduct.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import type { CartItem } from "../types/cart.js";

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  let recorder: any;

  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" , user: req.user});
    }

    const userId = req.user.id;
    
  recorder = await sequelize.transaction();
    if (!userId) {
      await recorder.rollback();
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated", user: req.user });
    }

    const cart = await Cart.findOne({
      where: { user_id: userId },
      transaction: recorder,
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      await recorder.rollback();
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const items: CartItem[] = cart.items;

    // group items by store, since one order = one store
    const storeGroups: Record<string, CartItem[]> = {};

    for (const item of items) {
      const storeProduct = await StoreProduct.findByPk(item.storeProductId, {
        transaction: recorder,
      });

      if (!storeProduct) {
        await recorder.rollback();
        return res
          .status(404)
          .json({
            success: false,
            message: `Product ${item.storeProductId} not found`,
          });
      }

      if (storeProduct.quantity < item.quantity) {
        await recorder.rollback();
        return res
          .status(400)
          .json({
            success: false,
            message: `Not enough stock for ${storeProduct.id}, ${storeProduct.quantity} Available`,
          });
      }

      const storeId = storeProduct.store_id;
      if (!storeGroups[storeId]) storeGroups[storeId] = [];
      storeGroups[storeId].push(item);
     }

    const createdOrders = [];

    for (const storeId of Object.keys(storeGroups)) {
      
      
      const groupItems = storeGroups[storeId]!;
      const total = groupItems.reduce(
        (sum, i) => sum + StoreProduct.price * i.quantity,
        0,
      );

      const order = await Order.create(
        { user_id: userId, store_id: storeId, total, status: "pending" },
        { transaction: recorder },
      );

      if (!order) {
        await recorder.rollback();
        return res
          .status(401)
          .json({ success: false, message: "Order not created!" });
      }

      for (const item of groupItems) {
        const subtotal = item.price * item.quantity;
        let createdItem = await OrderItem.create(
          {
            order_id: order.id,
            store_product_id: item.storeProductId,
            quantity: item.quantity,
            price: item.price,
            subtotal: subtotal,
          },
          { transaction: recorder },
        );

        if (!createdItem) {
          await recorder.rollback();
          return res
            .status(401)
            .json({
              success: false,
              message: `Failed to create order item : ${item}`,
            });
        }

        // decrement stock
        const storeProduct = await StoreProduct.findByPk(item.storeProductId, {
          transaction: recorder,
        });
        if (storeProduct) {
          await storeProduct.decrement("quantity", {
            by: item.quantity,
            transaction: recorder,
          });
        }
      }

      createdOrders.push(order);
    }

    // clear the cart
    cart.items = [];
    cart.changed("items", true);
    await cart.save({ transaction: recorder });

    await recorder.commit();

    return res.status(201).json({ success: true, orders: createdOrders });
  } catch (error) {
    await recorder.rollback();
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
