import { Schema, model, type InferSchemaType, type Types } from "mongoose";

export type UserRole = "admin" | "sales";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "sales"], default: "sales" }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };

export const UserModel = model("User", userSchema);
