import express  from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { createNote } from "../controller/notes/create.controller";
import { deleteNote } from "../controller/notes/delete.controller";
import { getAllNotes } from "../controller/notes/getAll.controller";
import { getOneNote } from "../controller/notes/getOne.controller";

export const notesRouter = express.Router()

notesRouter.post("/",isAuthenticated,createNote);
notesRouter.delete("/:id",isAuthenticated,deleteNote);
notesRouter.get("/",isAuthenticated,getAllNotes);
notesRouter.get("/:id",isAuthenticated,getOneNote);
notesRouter.patch("/:id",isAuthenticated,deleteNote);