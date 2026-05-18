"use client";

import { useCallback, useState } from "react";

export type ToastState = {
  message: string;
  type: "success" | "error";
};

export const useToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastState["type"]) => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  return { toast, showToast };
};
