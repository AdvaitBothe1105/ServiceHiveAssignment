import { userRepository } from "../repositories/user.repository";
import { HttpError } from "../utils/httpError";

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

export const userService = {
  async list(): Promise<PublicUser[]> {
    const users = await userRepository.listAll();
    return users.map(toPublicUser);
  },
  async updateRole(
    targetId: string,
    role: "admin" | "sales",
    requestingUserId: string
  ): Promise<PublicUser> {
    if (targetId === requestingUserId) {
      throw new HttpError(403, "You cannot change your own role");
    }

    const updated = await userRepository.updateRoleById(targetId, role);
    if (!updated) {
      throw new HttpError(404, "User not found");
    }
    return toPublicUser(updated);
  }
};
