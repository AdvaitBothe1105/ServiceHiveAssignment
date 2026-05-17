"use client";

import type { ToastState } from "../../hooks/useToast";

type ToastProps = {
  toast: ToastState | null;
};

export default function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div
      className={`fixed right-6 top-6 z-[100] max-w-sm rounded-2xl border px-5 py-3 text-sm shadow-lg ${
        toast.type === "success"
          ? "border-primary/40 bg-card text-foreground"
          : "border-destructive/40 bg-card text-destructive"
      }`}
      role="status"
    >
      {toast.message}
    </div>
  );
}
