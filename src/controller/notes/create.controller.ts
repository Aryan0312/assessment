import { Request, Response } from "express";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const createNote = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body) {
    throw new ApiError(400, "Req body is requird");
  }

  const { title, content } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are mendatory");
  }

  const userId = req.session.userId;

  const result = await pool.query(
    "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
    [userId, title, content]
  );

  res.status(201).json({
    succes: true,
    data: result.rows[0],
  });
});