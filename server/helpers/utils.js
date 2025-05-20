import jwt from "jsonwebtoken";

export const generateToken = (userId, role = null, res = null) => {
  try {
    // Create token payload
    const payload = { userId };
    if (role) payload.role = role;

    // Generate JWT token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie if response object is provided
    if (res && typeof res.cookie === "function") {
      const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevent XSS attacks
        sameSite: "strict", // Prevent CSRF attacks
        secure: process.env.NODE_ENV !== "development", // HTTPS only in production
      };

      // For cross-site usage if needed (optional)
      if (process.env.NODE_ENV === "production" && process.env.DOMAIN) {
        cookieOptions.domain = process.env.DOMAIN;
      }

      res.cookie("jwt", token, cookieOptions);
    }

    return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error("Failed to generate authentication token");
  }
};