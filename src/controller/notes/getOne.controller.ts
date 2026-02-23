import { Request, Response } from "express";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const getOneNote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.session.userId;

  console.log("sessoin",id);
  

  const result = await pool.query(
    "SELECT * FROM notes WHERE id = $1 AND user_id = $2",
    [id, userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, "Note not found !");
  }

  res.status(200).json({
    succes: true,
    data: result.rows[0],
  });
});