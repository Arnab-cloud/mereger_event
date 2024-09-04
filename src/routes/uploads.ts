import { Router } from "express";
import handleImages from "../controllers/uploads";

const uploadRouter = Router();
uploadRouter.post("/", handleImages);

export default uploadRouter;
