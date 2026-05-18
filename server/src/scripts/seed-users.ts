import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../config/db";
import { UserModel } from "../models/user.model";

const DEFAULT_PASSWORD = "Password1";

const SEED_USERS: Array<{ name: string; email: string; role: "admin" | "sales" }> = [
  { name: "Avery Signal", email: "avery@signalops.test", role: "admin" },
  { name: "Jordan Pike", email: "jordan@signalops.test", role: "sales" },
  { name: "Morgan Blake", email: "morgan@signalops.test", role: "sales" },
  { name: "Riley Chen", email: "riley@signalops.test", role: "sales" },
  { name: "Casey Holt", email: "casey@signalops.test", role: "sales" },
  { name: "Taylor Reed", email: "taylor@signalops.test", role: "sales" },
  { name: "Jamie Fox", email: "jamie@signalops.test", role: "sales" },
  { name: "Quinn Nash", email: "quinn@signalops.test", role: "sales" },
  { name: "Drew Lane", email: "drew@signalops.test", role: "sales" },
  { name: "Sam Rivera", email: "sam@signalops.test", role: "sales" },
  { name: "Alex Mercer", email: "alex@signalops.test", role: "sales" },
  { name: "Blake Sutton", email: "blake@signalops.test", role: "sales" },
  { name: "Cameron Vale", email: "cameron@signalops.test", role: "admin" },
  { name: "Dana Brooks", email: "dana@signalops.test", role: "sales" },
  { name: "Ellis Grant", email: "ellis@signalops.test", role: "sales" }
];

const seed = async (): Promise<void> => {
  await connectDb();
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  let created = 0;
  let skipped = 0;

  for (const user of SEED_USERS) {
    const exists = await UserModel.findOne({ email: user.email });
    if (exists) {
      skipped += 1;
      continue;
    }
    await UserModel.create({ ...user, passwordHash });
    created += 1;
  }

  const total = await UserModel.countDocuments();
  console.log(`Seed complete: ${created} created, ${skipped} skipped (already existed).`);
  console.log(`Total users in database: ${total}`);
  console.log(`All seed accounts use password: ${DEFAULT_PASSWORD}`);
};

seed()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error: unknown) => {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  });
