import User from "./User.js";
import Rider from "./Rider.js";
import Store from "./Store.js";
import Product from "./Products.js";
import StoreProduct from "./StoreProduct.js";
import Category from "./Category.js";
import Cart from "./Cart.js";
import Order from "./Order.ts";
import OrderItem from "./OrderItem.ts";


User.hasOne(Rider, {
    foreignKey: "user_id",
});

Rider.belongsTo(User, {
    foreignKey: "user_id"
})

User.hasMany(Store, {
    foreignKey: "owner_id"
})

Store.belongsTo(User, {
    foreignKey: "owner_id"
})


Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

Store.hasMany(StoreProduct, { foreignKey: "store_id" });
StoreProduct.belongsTo(Store, { foreignKey: "store_id" });

Product.hasMany(StoreProduct, { foreignKey: "product_id" });
StoreProduct.belongsTo(Product, { foreignKey: "product_id" });

User.hasOne(Cart,{foreignKey: "user_id"});
Cart.belongsTo(User, {foreignKey: 'user_id'});

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

Store.hasMany(Order, { foreignKey: "store_id" });
Order.belongsTo(Store, { foreignKey: "store_id" });

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

StoreProduct.hasMany(OrderItem, { foreignKey: "store_product_id" });
OrderItem.belongsTo(StoreProduct, { foreignKey: "store_product_id" });

export { Store, Product, StoreProduct, Category, Cart, Order, OrderItem };