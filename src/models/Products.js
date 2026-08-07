import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "categories", key: "id" },
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
  }
);

export default Product;