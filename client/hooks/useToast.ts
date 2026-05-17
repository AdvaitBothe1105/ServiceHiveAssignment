"use client";

import { useCallback, useState } from "react";

export type ToastState = {
  message: string;
  type: "success" | "error";
};

const TOAST_DURATION_MS = 3000;

export const useToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastState["type"]) => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  return { toast, showToast };
};
