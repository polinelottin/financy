import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Lock, LogIn, Mail, UserRound } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/auth/auth-context";
import { AuthCard, Divider } from "@/components/auth-card";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";

const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
    }
  }
`;

const schema = z.object({
  name: z.string().trim().min(1, "Informe seu nome"),
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const { signIn } = useAuth();
  const [registerUser] = useMutation<{ register: { token: string } }>(REGISTER);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(input: FormData) {
    try {
      const { data } = await registerUser({ variables: { input } });
      signIn(data!.register.token);
    } catch (error) {
      setError("root", { message: (error as Error).message });
    }
  }

  return (
    <AuthCard title="Criar conta" description="Comece a controlar suas finanças ainda hoje">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        <FormField
          id="name"
          label="Nome completo"
          icon={UserRound}
          placeholder="Seu nome completo"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="email"
          label="E-mail"
          icon={Mail}
          type="email"
          placeholder="mail@exemplo.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          id="password"
          label="Senha"
          icon={Lock}
          type="password"
          placeholder="Digite sua senha"
          hint="A senha deve ter no mínimo 8 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />
        {errors.root && <p className="text-center text-sm text-danger">{errors.root.message}</p>}
        <Button type="submit" disabled={isSubmitting} className="h-12 text-base">
          Cadastrar
        </Button>
      </form>
      <Divider />
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-gray-600">Já tem uma conta?</p>
        <Button asChild variant="outline" className="h-12 bg-white text-base text-gray-700">
          <Link to="/">
            <LogIn className="size-4.5" />
            Fazer login
          </Link>
        </Button>
      </div>
    </AuthCard>
  );
}
