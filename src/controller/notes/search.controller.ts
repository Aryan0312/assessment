import { Request, Response } from "express";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const searchNotes = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const userId = req.session.userId;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!q || typeof q !== "string") {
    throw new ApiError(400, "Search query is requird");
  }

  const offset = (page-1)*limit;

  const result = await pool.query(
    `SELECT * FROM notes 
     WHERE user_id = $1 
     AND (title ILIKE $2 OR content ILIKE $2)
     ORDER BY created_at DESC OFFSET $3 LIMIT $4;`,
    [userId, `%${q}%`,offset,limit]
  );

  res.status(200).json({
    succes: true,
    total: result.rows.length,
    data: result.rows,
  });
});