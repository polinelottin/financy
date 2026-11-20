import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Lock, LogIn } from "lucide-react";
import { z } from "zod";
import { AuthCard } from "@/components/auth-card";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";

const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password)
  }
`;

const schema = z.object({
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { password: "" } });

  async function onSubmit({ password }: FormData) {
    try {
      await resetPassword({ variables: { token, password } });
      setDone(true);
    } catch (error) {
      setError("root", { message: (error as Error).message });
    }
  }

  return (
    <AuthCard title="Redefinir senha" description="Escolha uma nova senha para a sua conta">
      {!token && <p className="text-center text-danger">Link inválido ou expirado</p>}
      {token && done && <p className="text-center text-gray-700">Senha alterada. Entre com a nova senha.</p>}
      {token && !done && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
          <FormField
            id="password"
            label="Nova senha"
            icon={Lock}
            type="password"
            placeholder="Digite a nova senha"
            hint="A senha deve ter no mínimo 8 caracteres"
            error={errors.password?.message}
            {...register("password")}
          />
          {errors.root && <p className="text-center text-sm text-danger">{errors.root.message}</p>}
          <Button type="submit" disabled={isSubmitting} className="h-12 text-base">
            Redefinir senha
          </Button>
        </form>
      )}
      <Button asChild variant="outline" className="h-12 bg-white text-base text-gray-700">
        <Link to="/">
          <LogIn className="size-4.5" />
          Fazer login
        </Link>
      </Button>
    </AuthCard>
  );
}
