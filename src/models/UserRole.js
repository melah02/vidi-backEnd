import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class UserRole extends Model {}

UserRole.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "user_roles",
    timestamps: true,
  }
);

export default UserRole;