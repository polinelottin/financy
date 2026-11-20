import { useState, type ComponentProps } from "react";
import { Eye, EyeClosed, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormFieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: string;
};

export function FormField({ id, label, icon: Icon, error, hint, type, ...props }: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={Boolean(error)}
          className="h-12 bg-white pl-10 text-base placeholder:text-gray-400 disabled:bg-gray-100 md:text-base"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-700"
          >
            {showPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : (
        hint && <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
}
