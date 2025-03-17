import jwt from "jsonwebtoken";
import JWT_SECRET from "../config.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ msg: "Something is Wrong!" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded?.userId) {
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({ msg: "Wrong Auth Inputs!" });
        }
    } catch (error) {
        return res.status(403).json({ msg: "Something went Wrong!" });
    }
};
