import User from "./User.js";
import Store from "./Store.js";
import Rider from "./Rider.js";

User.hasOne(Rider, {
    foreignKey: "user_id",
});

Rider.belongsTo(User,{
    foreignKey: "user_id"
})

User.hasMany(Store, {
    foreignKey: "user_id"
})

Store.belongsTo(User, {
    foreignKey: "user_id"
})
