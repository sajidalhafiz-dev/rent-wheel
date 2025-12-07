import { JwtPayload } from "jsonwebtoken";
import dayjs from "dayjs";
import { pool } from "../../config/db";

const createBooking = async (
  payload: Record<string, unknown>,
  user: JwtPayload
) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  
  if (user.role === "customer" && user.id !== customer_id!.toString()) {
    throw new Error(
      "Forbidden: Customers can only create bookings for their own account"
    );
  }

  
  const vehicleRes = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'`,
    [vehicle_id]
  );

  if (vehicleRes.rows.length === 0) {
    throw new Error("Vehicle is not available");
  }

  const vehicle = vehicleRes.rows[0];

  // Calculate total price
  const number_of_days = dayjs(rent_end_date as string).diff(
    dayjs(rent_start_date as string),
    "day"
  );

  if (number_of_days <= 0) throw new Error("End date must be after start date");

  const total_price = number_of_days * vehicle.daily_rent_price;

  
  const bookingRes = await pool.query(
    `INSERT INTO bookings 
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  
  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return {
    ...bookingRes.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getAllBookings = async (user: JwtPayload) => {
  if (user.role === "admin") {
    const result = await pool.query(`
      SELECT b.*, 
        u.name AS customer_name, u.email AS customer_email,
        v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);

    const updatedData = result.rows[0];
    const data = [
      {
        id: updatedData.id,
        customer_id: updatedData.customer_id,
        vehicle_id: updatedData.vehicle_id,
        rent_start_date: new Date(updatedData.rent_start_date)
          .toISOString()
          .split("T")[0],
        rent_end_date: new Date(updatedData.rent_end_date)
          .toISOString()
          .split("T")[0],
        total_price: Number(updatedData.total_price),
        status: updatedData.status,
        customer: {
          name: updatedData.customer_name,
          email: updatedData.customer_email,
        },
        vehicle: {
          vehicle_name: updatedData.vehicle_name,
          registration_number: updatedData.registration_number,
        },
      },
    ];
    return {
      message: "Bookings retrieved successfully",
      data,
    };
  }

  /**
   * {
   * "success":true,
   * "message":"Bookings retrieved successfully",
   * "data":[
   *    {
   *       "id":1,
   *       "customer_id":1,
   *       "vehicle_id":1,
   *       "rent_start_date":"2024-01-14",
   *       "rent_end_date":"2024-01-19",
   *       "total_price":250,
   *       "status":"active",
   *       "customer":{
   *          "name":"John Doe Updated",
   *          "email":"john.updated@example.com"
   *       },
   *       "vehicle":{
   *          "vehicle_name":"Toyota Camry 2024",
   *          "registration_number":"ABC-1234"
   *       }
   *    }
   *  ]
   * }
   */
  
  // Customer bookings
  const result = await pool.query(
    `
    SELECT b.*, 
      v.vehicle_name, v.registration_number, v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
  `,
    [user.id]
  );
  const updatedData = result.rows[0];
  const data = [
    {
      id: updatedData.id,
      customer_id: updatedData.customer_id,
      vehicle_id: updatedData.vehicle_id,
      rent_start_date: new Date(updatedData.rent_start_date)
        .toISOString()
        .split("T")[0],
      rent_end_date: new Date(updatedData.rent_end_date)
        .toISOString()
        .split("T")[0],
      total_price: Number(updatedData.total_price),
      status: updatedData.status,
      vehicle: {
        vehicle_name: updatedData.vehicle_name,
        registration_number: updatedData.registration_number,
        type: updatedData.type,
      },
    },
  ];
  return {
    message: "Your bookings retrieved successfully",
    data,
  };
};

const updateBooking = async (
  bookingId: string,
  payload: Record<string, unknown>,
  user: JwtPayload
) => {
  const { status } = payload;

  
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    bookingId,
  ]);

  if (bookingRes.rows.length === 0) throw new Error("Booking not found");

  const booking = bookingRes.rows[0];

  
  if (user.role === "customer" && user.id !== booking.customer_id.toString()) {
    throw new Error("Forbidden: You can only update your own bookings");
  }

  
  if (user.role === "customer" && status === "cancelled") {
    if (dayjs().isAfter(dayjs(booking.rent_start_date))) {
      throw new Error("You cannot cancel a booking after the start date");
    }
  }

  
  if (status === "returned") {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
  }

  
  const result = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, bookingId]
  );

  const updatedData = result.rows[0];

  if (status === "returned") {
    const data = [
      {
        id: updatedData.id,
        customer_id: updatedData.customer_id,
        vehicle_id: updatedData.vehicle_id,
        rent_start_date: new Date(updatedData.rent_start_date)
          .toISOString()
          .split("T")[0],
        rent_end_date: new Date(updatedData.rent_end_date)
          .toISOString()
          .split("T")[0],
        total_price: Number(updatedData.total_price),
        status: updatedData.status,
        vehicle: {
          availability_status: "available",
        },
      },
    ];
    return {
      message: "Booking marked as returned. Vehicle is now available",
      data: data
    };
  }

  if (status === "cancelled") {
    const data = [
      {
        id: updatedData.id,
        customer_id: updatedData.customer_id,
        vehicle_id: updatedData.vehicle_id,
        rent_start_date: new Date(updatedData.rent_start_date)
          .toISOString()
          .split("T")[0],
        rent_end_date: new Date(updatedData.rent_end_date)
          .toISOString()
          .split("T")[0],
        total_price: Number(updatedData.total_price),
        status: updatedData.status
      },
    ];
    return {
      message: "Booking cancelled successfully",
      data: data
    };
  }

  return {
    message: "Booking updated",
    data: result.rows[0],
  };
};

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
};
