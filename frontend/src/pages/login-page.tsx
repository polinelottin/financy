import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Lock, Mail, UserRoundPlus } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/auth/auth-context";
import { AuthCard, Divider } from "@/components/auth-card";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`;

const schema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe a senha"),
  remember: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { signIn } = useAuth();
  const [login] = useMutation<{ login: { token: string } }>(LOGIN);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function onSubmit({ remember, ...input }: FormData) {
    try {
      const { data } = await login({ variables: { input } });
      signIn(data!.login.token, remember);
    } catch (error) {
      setError("root", { message: (error as Error).message });
    }
  }

  return (
    <AuthCard title="Fazer login" description="Entre na sua conta para continuar">
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
        <FormField
          id="password"
          label="Senha"
          icon={Lock}
          type="password"
          placeholder="Digite sua senha"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="remember"
              render={({ field }) => (
                <Checkbox id="remember" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="remember" className="font-normal text-gray-700">
              Lembrar-me
            </Label>
          </div>
          <Link to="/recuperar-senha" className="text-sm font-medium text-brand-base hover:underline">
            Recuperar senha
          </Link>
        </div>
        {errors.root && <p className="text-center text-sm text-danger">{errors.root.message}</p>}
        <Button type="submit" disabled={isSubmitting} className="h-12 text-base">
          Entrar
        </Button>
      </form>
      <Divider />
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-gray-600">Ainda não tem uma conta?</p>
        <Button asChild variant="outline" className="h-12 bg-white text-base text-gray-700">
          <Link to="/cadastro">
            <UserRoundPlus className="size-4.5" />
            Criar conta
          </Link>
        </Button>
      </div>
    </AuthCard>
  );
}
