import mongoose from "mongoose";
import { connectDb } from "../config/db";
import { LeadModel } from "../models/lead.model";
import { UserModel } from "../models/user.model";
import type { LeadSource, LeadStatus } from "@shared/validators";

type SeedLead = {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  monthsAgo: number;
  dayOfMonth: number;
  assignToSalesIndex?: number;
};

/** monthsAgo: 0 = current month, 5 = five months back */
const SEED_LEADS: SeedLead[] = [
  { name: "Nina Ortiz", email: "nina.ortiz@leadseed.test", status: "new", source: "website", monthsAgo: 5, dayOfMonth: 8, assignToSalesIndex: 0 },
  { name: "Marcus Webb", email: "marcus.webb@leadseed.test", status: "contacted", source: "referral", monthsAgo: 5, dayOfMonth: 19, assignToSalesIndex: 1 },
  { name: "Priya Shah", email: "priya.shah@leadseed.test", status: "qualified", source: "instagram", monthsAgo: 4, dayOfMonth: 6, assignToSalesIndex: 2 },
  { name: "Leo Hartman", email: "leo.hartman@leadseed.test", status: "lost", source: "website", monthsAgo: 4, dayOfMonth: 22 },
  { name: "Emma Collins", email: "emma.collins@leadseed.test", status: "new", source: "referral", monthsAgo: 3, dayOfMonth: 4, assignToSalesIndex: 3 },
  { name: "Omar Hassan", email: "omar.hassan@leadseed.test", status: "contacted", source: "website", monthsAgo: 3, dayOfMonth: 17, assignToSalesIndex: 4 },
  { name: "Sofia Marin", email: "sofia.marin@leadseed.test", status: "qualified", source: "referral", monthsAgo: 3, dayOfMonth: 26, assignToSalesIndex: 0 },
  { name: "Ethan Park", email: "ethan.park@leadseed.test", status: "new", source: "instagram", monthsAgo: 2, dayOfMonth: 9, assignToSalesIndex: 5 },
  { name: "Hannah Liu", email: "hannah.liu@leadseed.test", status: "contacted", source: "instagram", monthsAgo: 2, dayOfMonth: 21, assignToSalesIndex: 6 },
  { name: "Victor Kane", email: "victor.kane@leadseed.test", status: "qualified", source: "website", monthsAgo: 1, dayOfMonth: 5, assignToSalesIndex: 7 },
  { name: "Zoe Bennett", email: "zoe.bennett@leadseed.test", status: "new", source: "referral", monthsAgo: 1, dayOfMonth: 14 },
  { name: "Ryan O'Neill", email: "ryan.oneill@leadseed.test", status: "lost", source: "instagram", monthsAgo: 1, dayOfMonth: 24, assignToSalesIndex: 8 },
  { name: "Mia Torres", email: "mia.torres@leadseed.test", status: "contacted", source: "website", monthsAgo: 0, dayOfMonth: 3, assignToSalesIndex: 9 },
  { name: "Chris Dalton", email: "chris.dalton@leadseed.test", status: "qualified", source: "referral", monthsAgo: 0, dayOfMonth: 11, assignToSalesIndex: 1 },
  { name: "Aisha Rahman", email: "aisha.rahman@leadseed.test", status: "new", source: "website", monthsAgo: 0, dayOfMonth: 20, assignToSalesIndex: 2 }
];

const createdAtForMonth = (monthsAgo: number, dayOfMonth: number): Date => {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, dayOfMonth, 12, 0, 0, 0);
  return date;
};

const seed = async (): Promise<void> => {
  await connectDb();

  const deleted = await LeadModel.deleteMany({});
  console.log(`Removed ${deleted.deletedCount} existing lead(s).`);

  const salesUsers = await UserModel.find({ role: "sales" }).sort({ createdAt: 1 }).lean();
  let created = 0;

  for (const lead of SEED_LEADS) {
    const assignedTo =
      lead.assignToSalesIndex !== undefined && salesUsers.length > 0
        ? salesUsers[lead.assignToSalesIndex % salesUsers.length]._id
        : undefined;

    const createdAt = createdAtForMonth(lead.monthsAgo, lead.dayOfMonth);

    await LeadModel.create({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      assignedTo,
      createdAt,
      updatedAt: createdAt
    });
    created += 1;
  }

  const total = await LeadModel.countDocuments();
  console.log(`Seed complete: ${created} leads created across the last 6 months.`);
  console.log(`Total leads in database: ${total}`);
  if (salesUsers.length === 0) {
    console.log("Note: No sales users found — unassigned leads were created without assignees.");
  }
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
