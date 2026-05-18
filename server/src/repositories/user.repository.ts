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
  },
  async listAll(): Promise<UserDocument[]> {
    return UserModel.find().sort({ createdAt: -1 }).lean();
  },
  async findPaginated(page: number, limit: number): Promise<{ items: UserDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      UserModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      UserModel.countDocuments()
    ]);
    return { items, total };
  },
  async updateRoleById(id: string, role: "admin" | "sales"): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(id, { role }, { new: true }).lean();
  },
};
