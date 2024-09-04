import path from "node:path";

import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const destPath = process.env.TEMP_PATH || "input_images/";

const storage = multer.diskStorage({
	destination: (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, destination: string) => void
	) => {
		cb(null, destPath);
	},
	filename: (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, filename: string) => void
	) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (
		req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback
	) => {
		checkFileType(file, cb);
	},
}).single("image");

const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback) => {
	const fileTypes = /jpeg|jpg|png/;
	const extName = fileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = fileTypes.test(file.mimetype);
	if (mimetype && extName) {
		return cb(null, true);
	} else {
		cb(new Error("Error: Images only!"));
	}
};

export default upload;
