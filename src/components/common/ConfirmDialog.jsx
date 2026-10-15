import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            className={tone === "danger" ? "btn-danger" : "btn-primary"}
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/50 text-danger flex items-center justify-center shrink-0">
          <AlertTriangle size={20} />
        </div>
        <p className="text-sm text-muted dark:text-slate-400">{message}</p>
      </div>
    </Modal>
  );
}
