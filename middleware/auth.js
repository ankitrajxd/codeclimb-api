import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

function auth(req, res, next) {
  // get the cookie
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
}

async function admin(req, res, next) {
  const token = req.cookies.token;

  const decoded = jwt.decode(token);

  try {
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).send("Access denied. Only admin users allowed.");
    }
    next();
  } catch (error) {
    res.status(500).send("Internal Server Error.");
  }
}

export { auth, admin };
