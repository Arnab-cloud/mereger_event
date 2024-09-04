import mongoose, { ObjectId } from "mongoose";

interface IImage {
	fileName: string;
	path: string;
	mimetype: string;
	size: number;
	uploadDate: Date;
	opImageId?: ObjectId;
}

const imageSchema = new mongoose.Schema<IImage>(
	{
		fileName: { type: String, required: [true, "FileName is required"] },
		path: { type: String, required: [true, "path is required"] },
		mimetype: { type: String, required: [true, "mimetype is required"] },
		size: { type: Number, required: [true, "size is required"] },
		uploadDate: {
			type: Date,
			default: Date.now,
			required: [true, "upload date is required"],
		},
		opImageId: { type: mongoose.Schema.Types.ObjectId, ref: "images" },
	},
	{ timestamps: true }
);

const images = mongoose.model<IImage>("Images", imageSchema);

export default images;
