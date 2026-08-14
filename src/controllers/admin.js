import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ where: { role: 'user' }, attributes: ["id", "email", "phone", "full_name", "is_active", "is_verified"] });
        if(!users){
            return res.json({ success: false, message: 'No users found' });
        }
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};