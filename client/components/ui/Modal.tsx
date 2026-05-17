"use client";

import { createElement, useEffect, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Modal({ open, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createElement(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      role: "dialog",
      "aria-modal": true,
      "aria-labelledby": "modal-title"
    },
    createElement("button", {
      type: "button",
      className: "absolute inset-0 bg-foreground/40 backdrop-blur-sm",
      onClick: onClose,
      "aria-label": "Close modal"
    }),
    createElement(
      "div",
      {
        className:
          "relative z-10 w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-xl",
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        role: "presentation"
      },
      createElement("h2", { id: "modal-title", className: "text-lg font-semibold" }, title),
      createElement("div", { className: "mt-5" }, children),
      footer
        ? createElement(
            "div",
            { className: "mt-6 flex flex-wrap justify-end gap-3" },
            footer
          )
        : null
    )
  );
}
