import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mongoose from "mongoose";

const verifyUser = async (req, res, next) => {
  try {
    console.log("Middleware hit");
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      console.log(" No token provided");
      return res.status(404).json({ success: false, error: "Token Not Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(" Token Decoded:", decoded);
    
    if (!decoded) {
      return res.status(404).json({ success: false, error: "Token not valid" });
    }

    const user = await User.findById({_id: new mongoose.Types.ObjectId(''+decoded.id)}).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    res.locals.user = user;
    next();
  } catch (error) {
    console.error("Middleware Error",error)
    return res.status(500).json({ success: false, error: "Server Side Error (authMiddleware)"+error });
  }
};

export default verifyUser;
