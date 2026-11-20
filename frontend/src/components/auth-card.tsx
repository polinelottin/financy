import type { ReactNode } from "react";
import { Logo } from "./logo";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 px-4 py-12">
      <Logo />
      <div className="flex w-full max-w-112 flex-col gap-8 rounded-xl border bg-white p-8">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <span className="h-px flex-1 bg-gray-300" />
      ou
      <span className="h-px flex-1 bg-gray-300" />
    </div>
  );
}
