import express from "express"
import cors from "cors"
import sequelize from './config/database.js'
import AuthRoute from './route/Auth.js'
import storesRoute from './route/stores.js'
import categoryRoute from './route/category.js'
import productRoute from './route/product.js'
import adminRoute from './route/admin.js'
import './models/index.js'

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/auth", AuthRoute);
app.use("/api/Store", storesRoute);
app.use("/api/cat", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/admin", adminRoute);

try {

    await sequelize.authenticate();
    console.log('Connection has been established successfully.')

    await sequelize.sync();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })


} catch (error) {

    console.error('Unable to connect to the database:', error);
}

