import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "ACTIVE",
        "SUSPENDED",
        "BANNED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },

    online: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    phone_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    paranoid: true,
    timestamps: true,
  }
);

export default User;