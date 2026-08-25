// models/OrderItem.ts
import sequelize from "../config/database.js";
import { DataTypes, Model } from "sequelize";

interface OrderItemAttributes {
  id: string;
  order_id: string;
  store_product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
}
type OrderItemCreationAttributes = Omit<
  OrderItemAttributes,
  "id" | "subtotal"
> &
  Partial<Pick<OrderItemAttributes, "id" | "subtotal">>;

class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  public id!: string;
  public order_id!: string;
  public store_product_id!: string;
  public quantity!: number;
  public price!: number;
  public subtotal!: number;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "orders", key: "id" },
    },
    store_product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "store_products", key: "id" },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "OrderItem", tableName: "order_items" },
);

export default OrderItem;
