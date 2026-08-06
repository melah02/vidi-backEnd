import express from "express"
import cors from "cors"
import sequelize from './config/database.js'
import AuthRoute from './route/Auth.js'


const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/auth", AuthRoute);
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

