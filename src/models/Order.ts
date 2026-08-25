// models/Order.ts
import sequelize from "../config/database.js";
import { DataTypes, Model } from "sequelize";

interface OrderAttributes {
  id: string;
  user_id: string;
  store_id: string;
  total: number;
  status: "pending" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
}

// same effect as Sequelize's Optional<T, K> — built with plain TS
type OrderCreationAttributes = Omit<OrderAttributes, "id" | "status"> &
  Partial<Pick<OrderAttributes, "id" | "status">>;

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public user_id!: string;
  public store_id!: string;
  public total!: number;
  public status!: "pending" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
}

Order.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false, references: { model: "users", key: "id" } },
    store_id: { type: DataTypes.UUID, allowNull: false, references: { model: "stores", key: "id" } },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "out_for_delivery", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  { sequelize, modelName: "Order", tableName: "orders" }
);

export default Order;