"use client";

import { useFormStatus } from "react-dom";

type AdminSaveButtonProps = {
  label: string;
  loadingLabel: string;
};

export default function AdminSaveButton({
  label,
  loadingLabel,
}: AdminSaveButtonProps) {
  const { pending, data } = useFormStatus();
  const isSaving = pending && data?.get("intent") === "save";

  return (
    <button
      type="submit"
      name="intent"
      value="save"
      className="rounded-full bg-brand-lime px-6 py-3 text-sm font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isSaving}
      aria-busy={isSaving}
    >
      {isSaving ? (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-brand-ink/20 border-t-brand-ink"
            aria-hidden="true"
          />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
