"use client";

import { useMemo, useState } from "react";
import AuthShell from "../../../components/auth/AuthShell";
import AuthFormField from "../../../components/auth/AuthFormField";
import AuthToast from "../../../components/auth/AuthToast";
import { useToast } from "../../../hooks/useToast";
import { apiFetch } from "../../../lib/api";
import { authSchema } from "@shared/validators";
import type { z } from "zod";

type RegisterPayload = z.infer<typeof authSchema> & { name: string };

type RegisterResponse = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
  createdAt: string;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast } = useToast();

  const validationErrors = useMemo(() => {
    const result = authSchema
      .extend({ name: authSchema.shape.email })
      .safeParse({ name, email, password });

    if (result.success) {
      return {} as Record<keyof RegisterPayload, string>;
    }

    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] !== undefined ? String(issue.path[0]) : "";
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return fieldErrors as Record<keyof RegisterPayload, string>;
  }, [name, email, password]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (validationErrors.name || validationErrors.email || validationErrors.password) {
      showToast("Fix validation errors before continuing.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
      });
      showToast("Account created. Welcome aboard.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Registration failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Request dashboard access."
      subtitle="Provision your SignalOps credentials and join the command floor."
      footer={
        <span>
          Already cleared?{" "}
          <a className="text-primary hover:underline" href="/login">
            Sign in
          </a>
        </span>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthToast toast={toast} />
        <AuthFormField
          id="name"
          label="Name"
          type="text"
          value={name}
          placeholder="Avery Signal"
          onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
          onChange={setName}
          error={touched.name ? validationErrors.name : undefined}
        />
        <AuthFormField
          id="email"
          label="Email"
          type="email"
          value={email}
          placeholder="you@signalops.com"
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          onChange={setEmail}
          error={touched.email ? validationErrors.email : undefined}
        />
        <AuthFormField
          id="password"
          label="Password"
          type="password"
          value={password}
          placeholder="••••••••"
          onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
          onChange={setPassword}
          error={touched.password ? validationErrors.password : undefined}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Requesting..." : "Enter the Dashboard"}
        </button>
      </form>
    </AuthShell>
  );
}
