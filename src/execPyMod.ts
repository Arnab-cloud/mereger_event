import { exec } from "node:child_process";
import path from "node:path";

import { Response, Request } from "express";

const venvPath = path.join(
	path.dirname(__dirname),
	"web",
	"Scripts",
	"activate"
);
const pathToScript = path.join(__dirname, "app2.py");

export const executeScript = (req: Request, res: Response) => {
	if (req.file != undefined) {
		if (req.body.objId === null) {
			console.error("No obj id passed");
		}
		const command = `${venvPath} && python ${pathToScript} ${req.body.objId}`;
		console.log(`Command: ${command}`);

		exec(command, (err, stdout, stderr) => {
			if (err) {
				console.error(`Error: ${err.message}`);
				return res.status(500).send("Failed to execute script.");
			}
			if (stderr) {
				console.error(`Stderr: ${stderr}`);
				return res.status(500).send("Script execution failed.");
			}

			console.log(`Stdout: ${stdout}`);
			return res.status(200).redirect("/");
		});
	} else {
		console.error("Exec-python: Req.file is undefined");
	}
};
