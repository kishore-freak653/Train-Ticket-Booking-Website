import jwt from "jsonwebtoken";
import User from "../models/Usermodel.js";
import dotenv from "dotenv";

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Correct token extraction
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // Find the user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found with this ID" });
    }

    // Attach user to request object
    req.user = user;

    next(); // Move next() here after assigning req.user
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Middleware to grant access to specific roles
const grantAccess = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }
  };
};

// Correct export statement
export default { protect, grantAccess };
