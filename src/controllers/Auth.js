import User from "../models/user.js"
import Store from "../models/Store.js"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

function signToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export async function register(req, res) {
    try {
        const { full_name, email, password, phone } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({ message: "Email, full name and password are required" })
        }

        const existing = await User.findOne({ where: { email } })

        if (existing) {
            return res.status(409).json({ message: 'Email Already exist' })
        }

        const user = await User.create({
            full_name,
            email,
            phone,
            password_hash: password
        })

        const token = signToken(user);

        return res.status(201).json({
            success: true,
            token,
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function login(req, res, next) {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ where: { email } })
    

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = signToken(user);
    const store = await Store.findAll({
        where: { owner_id: req.user.id },
        attributes: ["id", "name", "slug"]
    })

    if(store.length > 0 ){

        return res.status(200).json({
            success: true,
            token,
            id: user.id,
            store,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone
        })
    }else{
        return res.status(200).json({
            success: true,
            token,
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone
        })
    }





}
