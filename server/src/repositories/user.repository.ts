import { UserModel, type UserDocument } from "../models/user.model";

export const userRepository = {
  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).lean();
  },
  async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).lean();
  },
  async createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
    role: "admin" | "sales";
  }): Promise<UserDocument> {
    const doc = await UserModel.create(input);
    return doc.toObject();
  }
};
