import { cn } from "@/lib/utils";

export function Avatar({ name = "", className }: { name?: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-800",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}
