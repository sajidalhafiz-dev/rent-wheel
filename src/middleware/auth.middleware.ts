import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";


const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = req.headers.authorization;

      if (!auth || !auth?.startsWith("Bearer "))
        return res.status(401).json({ message: "No token provided" });

      const token = auth.split(" ")[1];
      const decoded = jwt.verify(
        token as string,
        config.jwtSecret as string
      ) as JwtPayload;
      //   console.log({ decoded });
      req.user = decoded;

      
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(500).json({
          error: "You are not authorized!!!",
        });
      }

      next();
    } catch (err: any) {
      res.status(403).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default auth;
