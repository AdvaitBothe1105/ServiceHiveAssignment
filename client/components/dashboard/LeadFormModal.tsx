"use client";

import { useEffect, useMemo, useState } from "react";
import { leadBaseSchema, leadSourceEnum, leadStatusEnum } from "@shared/validators";
import type { z } from "zod";
import type { Lead } from "../../lib/types";
import type { PublicUser } from "../../lib/types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";

type FormValues = z.infer<typeof leadBaseSchema>;

type LeadFormModalProps = {
  open: boolean;
  lead: Lead | null;
  isAdmin: boolean;
  users: PublicUser[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
};

const emptyForm = (): FormValues => ({
  name: "",
  email: "",
  status: "new",
  source: "website",
  assignedTo: undefined
});

export default function LeadFormModal({
  open,
  lead,
  isAdmin,
  users,
  isSubmitting,
  onClose,
  onSubmit
}: LeadFormModalProps) {
  const [values, setValues] = useState<FormValues>(emptyForm());
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    if (lead) {
      setValues({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        assignedTo: lead.assignedTo
      });
    } else {
      setValues(emptyForm());
    }
    setTouched({});
  }, [open, lead]);

  const errors = useMemo(() => {
    const result = leadBaseSchema.safeParse(values);
    if (result.success) return {} as Record<string, string>;
    const map: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);
      if (!map[key]) map[key] = issue.message;
    }
    return map;
  }, [values]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, status: true, source: true });
    if (Object.keys(errors).length > 0) return;
    await onSubmit(values);
  };

  const statusOptions = leadStatusEnum.options.map((v) => ({
    value: v,
    label: v.charAt(0).toUpperCase() + v.slice(1)
  }));

  const sourceOptions = leadSourceEnum.options.map((v) => ({
    value: v,
    label: v.charAt(0).toUpperCase() + v.slice(1)
  }));

  const assignOptions = [
    { value: "", label: "Unassigned" },
    ...users.map((u) => ({ value: u._id, label: u.name }))
  ];

  return (
    <Modal
      open={open}
      title={lead ? "Edit lead" : "Add lead"}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="lead-form" isLoading={isSubmitting}>
            {lead ? "Save changes" : "Create lead"}
          </Button>
        </>
      }
    >
      <form id="lead-form" className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          error={touched.name ? errors.name : undefined}
        />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={touched.email ? errors.email : undefined}
        />
        <Select
          label="Status"
          options={statusOptions}
          value={values.status}
          onChange={(e) =>
            setValues((v) => ({ ...v, status: e.target.value as FormValues["status"] }))
          }
          error={touched.status ? errors.status : undefined}
        />
        <Select
          label="Source"
          options={sourceOptions}
          value={values.source}
          onChange={(e) =>
            setValues((v) => ({ ...v, source: e.target.value as FormValues["source"] }))
          }
          error={touched.source ? errors.source : undefined}
        />
        {isAdmin ? (
          <Select
            label="Assigned to"
            options={assignOptions}
            value={values.assignedTo ?? ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                assignedTo: e.target.value || undefined
              }))
            }
          />
        ) : null}
      </form>
    </Modal>
  );
}
