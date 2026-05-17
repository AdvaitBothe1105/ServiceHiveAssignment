import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { userRepository } from "../repositories/user.repository";
import { HttpError } from "../utils/httpError";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";

export type PublicUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
  createdAt: string;
};

const toPublicUser = (user: {
  _id: { toString: () => string };
  name: string;
  email: string;
  role: "admin" | "sales";
  createdAt: Date;
}): PublicUser => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString()
});

export const authService = {
  async register(input: RegisterInput): Promise<PublicUser> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new HttpError(400, "Email already in use");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const created = await userRepository.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
      role: "sales"
    });

    return toPublicUser(created);
  },
  async login(input: LoginInput): Promise<{ user: PublicUser; token: string }> {
    const existing = await userRepository.findByEmail(input.email);
    if (!existing) {
      throw new HttpError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(input.password, existing.passwordHash);
    if (!isValid) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      { sub: existing._id.toString(), role: existing.role, email: existing.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return { user: toPublicUser(existing), token };
  },
  async getMe(userId: string): Promise<PublicUser> {
    const existing = await userRepository.findById(userId);
    if (!existing) {
      throw new HttpError(404, "User not found");
    }

    return toPublicUser(existing);
  }
};
