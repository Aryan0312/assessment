import { Request, Response } from "express";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.session.userId;

  if (!title && !content) {
    throw new ApiError(400, "Nothing to upadte");
  }

  const existing = await pool.query(
    "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
    [id, userId]
  );

  if (existing.rows.length === 0) {
    throw new ApiError(404, "Note does not exsist");
  }

  const result = await pool.query(
    "UPDATE notes SET title = COALESCE($1, title), content = COALESCE($2, content), updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *",
    [title, content, id, userId]
  );

  res.status(200).json({
    succes: true,
    data: result.rows[0],
  });
});