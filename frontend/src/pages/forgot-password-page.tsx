import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { LogIn, Mail } from "lucide-react";
import { z } from "zod";
import { AuthCard } from "@/components/auth-card";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

const schema = z.object({
  email: z.email("Informe um e-mail válido"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function onSubmit({ email }: FormData) {
    try {
      await requestPasswordReset({ variables: { email } });
      setSent(true);
    } catch (error) {
      setError("root", { message: (error as Error).message });
    }
  }

  return (
    <AuthCard title="Recuperar senha" description="Informe seu e-mail para receber um link de redefinição">
      {sent ? (
        <p className="text-center text-gray-700">
          Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
          <FormField
            id="email"
            label="E-mail"
            icon={Mail}
            type="email"
            placeholder="mail@exemplo.com"
            error={errors.email?.message}
            {...register("email")}
          />
          {errors.root && <p className="text-center text-sm text-danger">{errors.root.message}</p>}
          <Button type="submit" disabled={isSubmitting} className="h-12 text-base">
            Enviar link
          </Button>
        </form>
      )}
      <Button asChild variant="outline" className="h-12 bg-white text-base text-gray-700">
        <Link to="/">
          <LogIn className="size-4.5" />
          Voltar para o login
        </Link>
      </Button>
    </AuthCard>
  );
}
