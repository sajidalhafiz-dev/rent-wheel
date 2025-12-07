import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
  const loggedInUser = req.user as JwtPayload;

  try {
    const result = await bookingService.createBooking(req.body, loggedInUser);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  const loggedInUser = req.user as JwtPayload;

  try {
    const { message, data } = await bookingService.getAllBookings(loggedInUser);

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const loggedInUser = req.user as JwtPayload;
  const bookingId = req.params.bookingId;

  try {
    const result = await bookingService.updateBooking(bookingId!, req.body, loggedInUser);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
