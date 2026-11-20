import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { LogOut, Mail, UserRound } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/auth/auth-context";
import { Avatar } from "@/components/avatar";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";

const PROFILE = gql`
  query Profile {
    me {
      id
      name
      email
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
    }
  }
`;

const schema = z.object({
  name: z.string().trim().min(1, "Informe seu nome"),
});

type FormData = z.infer<typeof schema>;
type Profile = { me: { id: string; name: string; email: string } };

export function ProfilePage() {
  const { signOut } = useAuth();
  const { data } = useQuery<Profile>(PROFILE);
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: "" } });

  useEffect(() => {
    if (data) reset({ name: data.me.name });
  }, [data, reset]);

  async function onSubmit(input: FormData) {
    setSaved(false);
    try {
      await updateProfile({ variables: { input } });
      setSaved(true);
    } catch (error) {
      setError("root", { message: (error as Error).message });
    }
  }

  if (!data) return null;

  return (
    <div className="mx-auto flex max-w-112 flex-col gap-8 rounded-xl border bg-white p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <Avatar name={data.me.name} className="size-16 text-2xl" />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-semibold text-gray-800">{data.me.name}</h1>
          <p className="text-gray-500">{data.me.email}</p>
        </div>
      </div>
      <hr className="border-gray-200" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        <FormField
          id="name"
          label="Nome completo"
          icon={UserRound}
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="email"
          label="E-mail"
          icon={Mail}
          value={data.me.email}
          hint="O e-mail não pode ser alterado"
          disabled
        />
        {errors.root && <p className="text-center text-sm text-danger">{errors.root.message}</p>}
        {saved && <p className="text-center text-sm text-success">Alterações salvas</p>}
        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={isSubmitting} className="h-12 text-base">
            Salvar alterações
          </Button>
          <Button type="button" variant="outline" onClick={signOut} className="h-12 bg-white text-base text-gray-700">
            <LogOut className="size-4.5 text-danger" />
            Sair da conta
          </Button>
        </div>
      </form>
    </div>
  );
}
