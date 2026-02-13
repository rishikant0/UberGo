import captainModel from "../models/captain.model.js";

export const createCaptain = async ({ fullname, email, password, vehicle }) => {
  if (!fullname || !email || !password || !vehicle) {
    throw new Error("Missing required fields");
  }

  return await captainModel.create({
    fullname,
    email,
    password,
    vehicle,
  });
};
