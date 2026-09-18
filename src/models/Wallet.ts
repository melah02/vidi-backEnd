import { DataTypes, Model,type Optional } from "sequelize";
import sequelize from "../config/database.js";

interface WalletAttributes {
  id: string;
  user_id: string;

  slimpay_user_id?: string | null;
  slimpay_wallet_id?: string | null;

  account_number?: string | null;
  account_name?: string | null;
  bank_name?: string | null;

  balance: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  is_verified: boolean;
}

interface WalletCreationAttributes
  extends Optional<
    WalletAttributes,
    | "id"
    | "slimpay_user_id"
    | "slimpay_wallet_id"
    | "account_number"
    | "account_name"
    | "bank_name"
    | "balance"
    | "status"
    | "is_verified"
  > {}

class Wallet
  extends Model<WalletAttributes, WalletCreationAttributes>
  implements WalletAttributes
{
  declare id: string;
  declare user_id: string;

  declare slimpay_user_id: string | null;
  declare slimpay_wallet_id: string | null;

  declare account_number: string | null;
  declare account_name: string | null;
  declare bank_name: string | null;

  declare balance: string;
  declare status: "PENDING" | "ACTIVE" | "SUSPENDED";
  declare is_verified: boolean;
}

Wallet.init(
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
    },

    slimpay_user_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    slimpay_wallet_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    account_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },

    account_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "ACTIVE",
        "SUSPENDED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Wallet",
    tableName: "wallets",
    timestamps: true,
  }
);

export default Wallet;