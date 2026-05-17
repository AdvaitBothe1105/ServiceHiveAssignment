"use client";

import type { ToastState } from "../../hooks/useToast";

type AuthToastProps = {
  toast: ToastState | null;
};

export default function AuthToast({ toast }: AuthToastProps) {
  if (!toast) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        toast.type === "success"
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-destructive/40 bg-destructive/10 text-destructive"
      }`}
    >
      {toast.message}
    </div>
  );
}
