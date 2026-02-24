import express, { Request, Response } from "express";
import morgan from "morgan";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { authRouter } from "./routes/authRouter.routes";
import { isAuthenticated } from "./middleware/authMiddleware";
import { notesRouter } from "./routes/notes.routes";
import { pool } from "./config/db";
import { corsConfig } from "./config/corsConfig";


const app = express();

dotenv.config(); 
app.use(corsConfig)
app.use(express.json());

const PgStore = connectPgSimple(session);

const sessionStore = new PgStore({
  pool: pool,
  tableName: "user_sessions",
  createTableIfMissing: true,
});

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1000,
});
//notes for me: allow 50 requests per minute 
const globalLimiter = rateLimit({
  windowMs:  60 * 1000, 
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);
app.use(morgan("dev"));


app.use("/api/auth",authLimiter,authRouter);
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