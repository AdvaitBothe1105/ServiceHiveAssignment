"use client";

import type { Lead } from "../../lib/types";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

type DeleteLeadModalProps = {
  open: boolean;
  lead: Lead | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteLeadModal({
  open,
  lead,
  isDeleting,
  onClose,
  onConfirm
}: DeleteLeadModalProps) {
  return (
    <Modal
      open={open}
      title="Delete lead"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" isLoading={isDeleting} onClick={() => void onConfirm()}>
            Delete lead
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-foreground">{lead?.name ?? "this lead"}</span>? This
        action cannot be undone.
      </p>
    </Modal>
  );
}
