import path from "node:path";

import express, { Request, Response } from "express";

import connectDB from "./connection";
import uploadRouter from "./routes/uploads";

const DB_URL = "mongodb://127.0.0.1:27017/";
connectDB(`${DB_URL}images`);

const upload_path = "uploads/";
const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.get("/", (req: Request, res: Response) => {
	console.log(__dirname);
	return res.status(200).render("home");
});

app.use("/upload", uploadRouter);

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
