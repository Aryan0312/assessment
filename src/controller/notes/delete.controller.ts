import { Request, Response } from "express";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.session.userId;

  const result = await pool.query(
    "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "Note alredy deleted or not exsist");
  }

  res.status(200).json({
    succes: true,
    message: "Note deleted succesfully",
  });
});