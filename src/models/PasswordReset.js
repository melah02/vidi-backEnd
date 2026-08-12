import { DataTypes, Model } from 'sequelize';
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";

class PasswordReset extends Model {
    async comparePassword(plainPassCode) {
        return bcrypt.compare(plainPassCode, this.password_hash);
    }
}

PasswordReset.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        passcode_hash: {
            type: DataTypes.STRING(64),
            allowNull: false,
        }
    }
    ,
    {
        sequelize,
        modelName: "PasswordReset",
        tableName: "passwordresets",
        hooks: {
            // hash password automatically whenever it's set
            beforeCreate: async (PasswordReset) => {
                if (PasswordReset.password_hash) {
                    PasswordReset.password_hash = await bcrypt.hash(PasswordReset.password_hash, 10);
                }
            },
        },
    }
);

export default PasswordReset;