import { DataTypes, Model, type Optional } from "sequelize";
import sequelize from "../config/database.js";

type WalletTransactionType =
  | "FUNDING"
  | "PURCHASE"
  | "REFUND"
  | "WITHDRAWAL"
  | "TRANSFER_IN"
  | "TRANSFER_OUT";

type WalletTransactionStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REVERSED";

interface WalletTransactionAttributes {
  id: string;
  wallet_id: string;

  type: WalletTransactionType;
  amount: string;
  status: WalletTransactionStatus;

  reference: string;
  description?: string | null;

  external_reference?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface WalletTransactionCreationAttributes
  extends Optional<
    WalletTransactionAttributes,
    | "id"
    | "description"
    | "external_reference"
    | "metadata"
    | "status"
  > {}

class WalletTransaction
  extends Model<
    WalletTransactionAttributes,
    WalletTransactionCreationAttributes
  >
  implements WalletTransactionAttributes
{
  declare id: string;
  declare wallet_id: string;

  declare type: WalletTransactionType;
  declare amount: string;
  declare status: WalletTransactionStatus;

  declare reference: string;
  declare description: string | null;

  declare external_reference: string | null;
  declare metadata: Record<string, unknown> | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

WalletTransaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    wallet_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        "FUNDING",
        "PURCHASE",
        "REFUND",
        "WITHDRAWAL",
        "TRANSFER_IN",
        "TRANSFER_OUT"
      ),
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "COMPLETED",
        "FAILED",
        "REVERSED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },

    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    external_reference: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "WalletTransaction",
    tableName: "wallet_transactions",
    timestamps: true,
  }
);

export default WalletTransaction;