import sequelize from '../config/database.js'
import { DataTypes, Model } from 'sequelize';

class Cart extends Model {

}

Cart.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type:DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users", key: "id"
            }
        },
        items:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        }
    },{
        sequelize,
        modelName: "Cart",
        tableName: "carts"
    }
)


export default Cart;