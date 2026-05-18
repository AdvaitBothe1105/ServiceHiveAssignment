import { Schema, model, type InferSchemaType, type Types } from "mongoose";
import { leadSourceEnum, leadStatusEnum } from "../../shared/validators";

const leadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    status: { type: String, enum: leadStatusEnum.options, required: true },
    source: { type: String, enum: leadSourceEnum.options, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ name: "text", email: "text" });

export type LeadDocument = InferSchemaType<typeof leadSchema> & { _id: Types.ObjectId };

export const LeadModel = model("Lead", leadSchema);
