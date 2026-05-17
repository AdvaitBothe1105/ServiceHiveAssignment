import { Transform } from "stream";
import type { LeadDocument } from "../models/lead.model";
import { computeLeadScore } from "./leadScore";

const escapeCsv = (value: string): string => {
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const createLeadCsvTransform = () => {
  let headerWritten = false;

  return new Transform({
    writableObjectMode: true,
    transform(chunk: LeadDocument, _encoding, callback) {
      if (!headerWritten) {
        this.push("Name,Email,Status,Source,Score,Created At\n");
        headerWritten = true;
      }

      const createdAt = chunk.createdAt.toISOString();
      const name = escapeCsv(chunk.name);
      const email = escapeCsv(chunk.email);
      const status = escapeCsv(chunk.status);
      const source = escapeCsv(chunk.source);
      const score = computeLeadScore(chunk).toString();

      this.push(`${name},${email},${status},${source},${score},${createdAt}\n`);
      callback();
    }
  });
};
