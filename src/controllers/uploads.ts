import path from "node:path";

import { Request, Response } from "express";

import images from "../models/image";
import upload from "../config";
import { executeScript } from "../execPyMod";

const upload_path = "input_images/";

export const updateDataBase = async (req: Request, res: Response) => {
	const file = req.file;
	req.body.objId = null;
	if (file != undefined) {
		try {
			const newFile = new images({
				fileName: file.originalname,
				path: path.join(upload_path, file.filename),
				mimetype: file.mimetype,
				size: file.size,
			});
			newFile
				.save()
				.then(() => console.log("data saved..."))
				.catch((err) => console.error(err));
			console.log("newFile:", newFile);
			req.body.objId = newFile._id.toString();
		} catch (err) {
			console.error("Database Error:", err);
			return res.status(500).send("Failed to save the file in Database");
		}
	} else {
		console.log("some thing is wrong");
		return res.status(500).send("No image file provided");
	}
};

const handleImages = async function (req: Request, res: Response) {
	upload(req, res, async (err: any) => {
		if (err) {
			return res.status(400).send({ message: err.message });
		} else if (req.file === undefined) {
			return res.status(400).send({ message: "No file Selected!" });
		} else {
			await updateDataBase(req, res);
			executeScript(req, res);
		}
	});
};

export default handleImages;
