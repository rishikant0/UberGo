import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blacklistTokenSchema = new Schema({
	token: { type: String, required: true, unique: true, index: true },
    
	createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
});

export default model("BlacklistToken", blacklistTokenSchema);
