import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { authRouter } from "./routes/authRouter.routes";
import { isAuthenticated } from "./middleware/authMiddleware";
import { notesRouter } from "./routes/notes.routes";


const app = express();

dotenv.config(); 
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);


app.use("/api/auth",authRouter);
app.use("/api/note",notesRouter);
app.get("/api", isAuthenticated, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});