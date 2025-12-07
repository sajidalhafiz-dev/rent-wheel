import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";
import { JwtPayload } from "jsonwebtoken";
import { QueryResult } from "pg";

const createVehicle = async (req: Request, res: Response) => {
  const loggedInUser = req.user as JwtPayload;
  let result: QueryResult;

  try {
    if (loggedInUser.role === "admin") {
      result = await vehicleServices.createVehicle(req.body);
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to create vehicle!",
      });
    }

    if (!result || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getVehicle();

    res.status(200).json({
      success: true,
      message: "Vehicels retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  
  try {
    const result = await vehicleServices.getSingleVehicle(req.params.vehicleId as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  
  const loggedInUser = req.user as JwtPayload;
  let result: QueryResult;

  try {
    if (loggedInUser.role === "admin") {
      result = await vehicleServices.updateVehicle(req.body, req.params.vehicleId!);
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid role",
      });
    }

    if (!result || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  
  try {
    const result = await vehicleServices.deleteVehicle(req.params.vehicleId!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle
};
