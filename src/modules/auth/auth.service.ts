import { pool } from "../../config/db";
import { comparePassword, hashPassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";

const loginUser = async (email: string, password: string) => {
  //   console.log({ email });
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  //   console.log({ result });
  if (result.rowCount === 0) {
    return null;
  }
  const user = result.rows[0];

  const match = await comparePassword(password, user.password);

  //   console.log({ match, user });
  if (!match) {
    return new Error("Invalid credentials");
  }


  const token = generateToken({
    id: user.id,
    role: user.role,
  });
  // console.log({ token });

  return { token, user };
};

const signUpUser = async (data: any) => {
  const { name, email, password, phone, role } = data;

  const exists = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (exists.rows.length > 0) return new Error("Email already exists");

  const hashed = await hashPassword(password);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashed, phone, role]
  );

  const user = result.rows[0];
  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  // console.log({token})
  return { token, user };
};

export const authServices = {
  loginUser,
  signUpUser
};
