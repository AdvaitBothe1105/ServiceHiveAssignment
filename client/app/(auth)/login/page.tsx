"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "../../../components/auth/AuthShell";
import AuthFormField from "../../../components/auth/AuthFormField";
import AuthToast from "../../../components/auth/AuthToast";
import { useUser } from "../../../contexts/UserContext";
import { useToast } from "../../../hooks/useToast";
import { apiFetch } from "../../../lib/api";
import { authSchema } from "@shared/validators";
import type { z } from "zod";

type LoginPayload = z.infer<typeof authSchema>;

type LoginResponse = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
  createdAt: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refresh } = useUser();
  const { toast, showToast } = useToast();

  const validationErrors = useMemo(() => {
    const result = authSchema.safeParse({ email, password });
    if (result.success) {
      return {} as Record<keyof LoginPayload, string>;
    }
    const fieldErrors: Partial<Record<keyof LoginPayload, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in fieldErrors)) {
        fieldErrors[field as keyof LoginPayload] = issue.message;
      }
    }
    return fieldErrors;
  }, [email, password]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    if (validationErrors.email || validationErrors.password) {
      showToast("Fix validation errors before continuing.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      await refresh();
      showToast("Welcome back. Access granted.", "success");
      router.push("/dashboard");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Login failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Return to the dashboard."
      subtitle="Authenticate to resume command of your SignalOps pipeline."
      footer={
        <span>
          Need an account?{" "}
          <a className="text-primary hover:underline" href="/register">
            Request access
          </a>
        </span>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthToast toast={toast} />
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
          {isSubmitting ? "Entering..." : "Enter the Dashboard"}
        </button>
      </form>
    </AuthShell>
  );
}
