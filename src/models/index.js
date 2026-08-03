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
    },

    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "user_roles",
    timestamps: true,
  }
);

export default UserRole;