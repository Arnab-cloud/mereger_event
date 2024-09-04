import mongoose from "mongoose";
const connectDB = async (DB_URL: string | undefined) => {
	try {
		if (DB_URL === undefined) {
			throw "Database url is undefined";
		}
		await mongoose
			.connect(DB_URL)
			.then(() => console.log("MongoDB connected"))
			.catch((err) => console.log("DB err: ", err));
	} catch (err: any) {
		console.log(err.message);
		process.exit(1);
	}
};

export default connectDB;
