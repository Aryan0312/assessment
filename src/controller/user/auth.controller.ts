import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const registerUser =  asyncHandler( async(req: Request, res: Response) => {
  if (!req.body) {
    throw new ApiError(400, "Invalid fields");
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "all fields are required");
  }
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new ApiError(400, "user already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name, email, hashedPassword]
  );

  res.status(201).json(result.rows[0]);
});

export const loginUser =  asyncHandler(async(req: Request, res: Response) => {
   if (!req.body) {
    throw new ApiError(400, "Invalid fields");
  }

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "all fields are required");
  }
  
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new ApiError(400, "INvalid credentials");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(400, "INvalid credentials");
  }

  req.session.userId = user.id;
  req.session.name = user.name;
  req.session.email = user.email;



  res.status(200).json({ message: "Login succesfully" });
});

export const logoutUser = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "Logged out" });
  });
};