"use client";

import { useState } from "react";
import { updateDisplayName } from "@/app/actions/settings";
import { toast } from "sonner";

export function NameForm({ defaultName }: { defaultName: string }) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      const result = await updateDisplayName(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Display name updated");
      }
    } catch {
      toast.error("Could not update name");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        name="name"
        defaultValue={defaultName}
        required
        minLength={2}
        maxLength={50}
        placeholder="Your name"
        className="h-11 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-lg bg-[var(--primary)] px-5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}