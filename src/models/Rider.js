import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Rider extends Model {}

Rider.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },

  },
  {
    sequelize,
    tableName: "rider_roles",
    timestamps: true,
  }
);

export default Rider;