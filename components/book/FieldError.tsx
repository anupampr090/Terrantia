import { CircleAlert } from "lucide-react";

export default function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-2 text-[14px] text-danger">
      <CircleAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
      <span>
        <span className="sr-only">Error: </span>
        {message}
      </span>
    </p>
  );
}
