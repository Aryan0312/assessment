import { Request, Response } from "express";
import { pool } from "../../config/db";
import { asyncHandler } from "../../utils/asyncHandler";

export const getAllNotes = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.userId;

  const result = await pool.query(
    "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );

  res.status(200).json({
    succes: true,
    total: result.rows.length,
    data: result.rows,
  });
});