import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { bookingController } from "./booking.controller";

const router = Router();

// Create booking (admin + customer)
router.post("/", auth("admin", "customer"), bookingController.createBooking);

// Get bookings (admin gets all, customer gets own)
router.get("/", auth("admin", "customer"), bookingController.getAllBookings);

// Update booking status (admin & customer)
router.put("/:bookingId", auth("admin", "customer"), bookingController.updateBooking);

export const bookingRoutes = router;
