import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Wrong Password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1hr" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const verify = (req, res) => {
  if (!res.locals.user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  return res.status(200).json({ success: true, user: res.locals.user });
};

export { login, verify };
