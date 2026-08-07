import User from "./User.js";
import Store from "./Store.js";
import Rider from "./Rider.js";
import Store from "./Store.js";
import Product from "./Product.js";
import StoreProduct from "./StoreProduct.js";
import Category from "./Category.js";


User.hasOne(Rider, {
    foreignKey: "user_id",
});

Rider.belongsTo(User, {
    foreignKey: "user_id"
})

User.hasMany(Store, {
    foreignKey: "user_id"
})

Store.belongsTo(User, {
    foreignKey: "user_id"
})


Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

Store.hasMany(StoreProduct, { foreignKey: "store_id" });
StoreProduct.belongsTo(Store, { foreignKey: "store_id" });

Product.hasMany(StoreProduct, { foreignKey: "product_id" });
StoreProduct.belongsTo(Product, { foreignKey: "product_id" });

export { Store, Product, StoreProduct, Category };