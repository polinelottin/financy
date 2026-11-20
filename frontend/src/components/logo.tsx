import { Coins } from "lucide-react";

export function Logo() {
  return (
    <span className="flex items-center gap-1.5 text-brand-base">
      <Coins className="size-6" strokeWidth={2.5} />
      <span className="text-lg font-extrabold tracking-wide uppercase">Financy</span>
    </span>
  );
}
