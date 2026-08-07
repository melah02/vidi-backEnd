import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js"; // adjust to your actual path

class Store extends Model {}

Store.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    logo_url: {
      type: DataTypes.TEXT,
    },
    kyc_status: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      defaultValue: "pending",
    },
    status: {
      type: DataTypes.ENUM("active", "suspended", "closed"),
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "Store",
    tableName: "stores",
  }
);

export default Store;