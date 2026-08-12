import User from "../models/user.js"
import Store from "../models/Store.js"
import PasswordReset from "../models/PasswordReset.js"
import jwt from "jsonwebtoken"
import { sendMessage } from "../services/reSend.js"
import bcrypt from "bcrypt"

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
    try {

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
            where: { owner_id: user.id },
            attributes: ["id", "name", "slug"]
        })

        if (store.length > 0) {

            return res.status(200).json({
                success: true,
                token,
                id: user.id,
                store,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
            })
        } else {
            return res.status(200).json({
                success: true,
                token,
                store: null,
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone
            })
        }




    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false
        })
    }

}

export const passwordResset = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email is required" })
        }

        const user = await User.findOne({ where: { email } })

        if (!user) {
            return res.json({ success: false, message: "Email not found" })
        }

        const passcode = () => { return Math.floor(100000 + Math.random() * 900000); }
        let code = passcode();
        const hashedCode = await bcrypt.hash(`${code}`, 10);

        const [passcodeReset, created] = await PasswordReset.findOrCreate({
            where: { email },
            defaults: { passcode_hash: hashedCode }
        });

        if (!created) {
            passcodeReset.passcode_hash = hashedCode;
            await passcodeReset.save();
        }
        const messageData = {
            to: "melxymelah02@gmail.com",
            from: 'onboarding@resend.dev',
            subject: 'Password Reset',
            html: `<h1>Password Reset</h1><p>Click the link below to reset your password</p><a href='http://localhost:5173/reset-password/${code}-${email}'>Reset Password</a></h4>`,
            text: 'Password Reset'
        }

        const response = await sendMessage(messageData);
        console.log("res",response);

        res.status(200).json({
            success: true,
            message: 'Reset code sent, this may take a minute..'
        })

    } catch (error) {
        console.error("Error",error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const passwordResetPost = async (req, res, next) => {
    try {
        const { email, passcode, newPassword } = req.body;

        if (!email || !passcode || !newPassword) {
            return res.json({ success: false, message: "All fields are required" })
        }

        const user = await User.findOne({ where: { email } })
        const resetPassword = await PasswordReset.findOne({ where: { email } })

        if (!user) {
            return res.json({ success: false, message: "Email not found" })
        }
        const isMatch = await  resetPassword.comparePassword(passcode)


        if (!isMatch) {
            return res.json({ success: false, message: "Invalid passcode" })
        }

        user.password_hash = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        })

    } catch (error) {
        console.error("Error",error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}
