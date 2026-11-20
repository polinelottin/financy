import { createElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/category-style";
import { cn } from "@/lib/utils";
import { CREATE_CATEGORY, UPDATE_CATEGORY, type Category } from "./queries";

const iconNames = Object.keys(CATEGORY_ICONS);
const colorNames = Object.keys(CATEGORY_COLORS) as (keyof typeof CATEGORY_COLORS)[];

const schema = z.object({
  title: z.string().trim().min(1, "Informe o título"),
  description: z.string().trim(),
  icon: z.string().min(1, "Selecione um ícone"),
  color: z.string(),
});

type FormData = z.infer<typeof schema>;

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
};

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 p-6 sm:max-w-112">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-800">
            {category ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">Organize suas transações com categorias</DialogDescription>
        </DialogHeader>
        <CategoryForm category={category} onSaved={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CategoryForm({ category, onSaved }: { category?: Category; onSaved: () => void }) {
  const [createCategory] = useMutation(CREATE_CATEGORY, { refetchQueries: "active" });
  const [updateCategory] = useMutation(UPDATE_CATEGORY, { refetchQueries: "active" });
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: category?.title ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "",
      color: category?.color ?? colorNames[0],
    },
  });

  async function onSubmit(values: FormData) {
    const input = { ...values, description: values.description || null };
    try {
      if (category) {
        await updateCategory({ variables: { id: category.id, input } });
      } else {
        await createCategory({ variables: { input } });
      }
      onSaved();
    } catch (error) {
      setError("root", { message: (error as Error).message });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className="text-gray-700">
          Título
        </Label>
        <Input
          id="title"
          placeholder="Ex. Alimentação"
          aria-invalid={Boolean(errors.title)}
          className="h-12 bg-white text-base md:text-base"
          {...register("title")}
        />
        {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="text-gray-700">
          Descrição
        </Label>
        <Input
          id="description"
          placeholder="Descrição da categoria"
          className="h-12 bg-white text-base md:text-base"
          {...register("description")}
        />
        <p className="text-xs text-gray-500">Opcional</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-gray-700">Ícone</Label>
        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <div className="grid grid-cols-8 gap-2">
              {iconNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-label={name}
                  aria-pressed={field.value === name}
                  onClick={() => field.onChange(name)}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg border text-gray-500 hover:bg-gray-100",
                    field.value === name && "border-brand-base bg-gray-100 text-gray-800",
                  )}
                >
                  {createElement(CATEGORY_ICONS[name], { className: "size-5" })}
                </button>
              ))}
            </div>
          )}
        />
        {errors.icon && <p className="text-xs text-danger">{errors.icon.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-gray-700">Cor</Label>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <div className="grid grid-cols-7 gap-2">
              {colorNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-label={name}
                  aria-pressed={field.value === name}
                  onClick={() => field.onChange(name)}
                  className={cn(
                    "rounded-lg border p-1",
                    field.value === name ? "border-brand-base bg-gray-100" : "border-gray-300",
                  )}
                >
                  <span className={cn("block h-5 rounded-md", CATEGORY_COLORS[name].solid)} />
                </button>
              ))}
            </div>
          )}
        />
      </div>

      {errors.root && <p className="text-center text-sm text-danger">{errors.root.message}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 h-12 text-base">
        Salvar
      </Button>
    </form>
  );
}
