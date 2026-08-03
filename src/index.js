import express from "express"
import cors from "cors"
import sequelize from './config/database.js'

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
})
try {

    await sequelize.authenticate();
    console.log('Connection has been established successfully.')



    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })


} catch (error) {

    console.error('Unable to connect to the database:', error);
}

