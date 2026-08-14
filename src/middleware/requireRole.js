// middleware/requireRole.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Forbidden" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
      req.user = decoded; //{email, id , role}
      if (!allowedRoles || allowedRoles.length === 0) {
        return res.status(401).json({ message: "roles not specified" });;
      }
      if(req.user.role && allowedRoles.includes(req.user.role)){
        next();
      } else {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  };
};