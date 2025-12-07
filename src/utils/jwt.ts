import jwt from "jsonwebtoken";
import config from "../config";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwtSecret!, { expiresIn: "10d" });
};
