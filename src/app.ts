import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import cors from "cors";

const app = express();
// parser
app.use(express.json());
app.use(cors());


// initializing DB
initDB();


// CRUD
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/vehicles", vehicleRoutes);
// app.use("/api/v1/bookings", bookingRoutes);

app.get("/test", (req, res) => {
  console.log("testing");
  res.send("Working");
});


// -- Request to other routes -> 404 -- //
// ... rest of your code

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
