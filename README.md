# Rent-Wheel 

**Live URL:** [(https://your-vercel-url.vercel.app)](https://rent-wheel-bay.vercel.app/)

Rent-Wheel is a **vehicle rental management system** that allows admins to manage vehicles and bookings, and customers to rent vehicles easily. The backend is built with **TypeScript, Express, and PostgreSQL**, following a modular architecture for scalability and maintainability.

---

## Features

- **User Management**
  - Admin can create, read, update, and delete users.
  - Customers can update their own profiles.
  
- **Vehicle Management**
  - Admin can add, update, and track vehicle availability.
  - Vehicles have types (`car`, `bike`, `van`, `SUV`) and rental prices.
  
- **Booking Management**
  - Admin can view all bookings.
  - Customers can create bookings for themselves and view their bookings.
  - Automatic vehicle availability updates when booking is created or returned.
  - Customers can cancel bookings before the start date.
  - Bookings automatically marked as returned after end date.
  
- **Authentication & Authorization**
  - JWT-based authentication.
  - Role-based access control (`admin` vs `customer`).

---

## Technology Stack

- **Backend:** Node.js, Express, TypeScript  
- **Database:** PostgreSQL  
- **Authentication:** JWT, bcryptjs  
- **Deployment:** Vercel (Serverless Functions)  
- **Other:** dayjs (date handling), CORS  

---

## Setup & Usage

### Prerequisites

- Node.js v18+
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sajidalhafiz-dev/rent-wheel.git
cd rent-wheel

npm install
