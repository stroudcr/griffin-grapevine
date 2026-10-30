import type { ReactNode } from "react";

export const inputClass =
  "mt-1.5 block w-full rounded-xl border border-navy/[0.16] bg-white px-4 py-2.5 text-[15px] text-ink shadow-[inset_0_1px_0_rgb(255_255_255_/_0.6)] outline-none transition placeholder:text-slate/50 focus:border-gold focus:ring-4 focus:ring-gold/15 aria-[invalid=true]:border-red-600";

interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

/** Label, hint and error around one input. The input should use `id` and aria-describedby={`${id}-help`}. */
export function FormField({ id, label, hint, error, optional, children, className = "" }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-slate">(optional)</span>}
      </label>
      {children}
      <p id={`${id}-help`} className={`mt-1.5 text-[13px] leading-5 ${error ? "font-medium text-red-700" : "text-slate"}`}>
        {error ?? hint}
      </p>
    </div>
  );
}
