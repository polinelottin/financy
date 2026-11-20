import { createElement, useState, type ReactNode } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowUpDown, Plus, SquarePen, Tag, Trash } from "lucide-react";
import { CategoryIcon, CategoryTag } from "@/components/category-badge";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/features/categories/category-dialog";
import { CATEGORIES, DELETE_CATEGORY, type Category, type CategoryWithTotals } from "@/features/categories/queries";
import { summarizeCategories } from "@/features/categories/summary";
import { categoryColor, categoryIcon } from "@/lib/category-style";
import { cn } from "@/lib/utils";

export function CategoriesPage() {
  const { data } = useQuery<{ categories: CategoryWithTotals[] }>(CATEGORIES);
  const [deleteCategory] = useMutation(DELETE_CATEGORY, { refetchQueries: "active" });
  const [dialog, setDialog] = useState<{ open: boolean; category?: Category }>({ open: false });
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const categories = data?.categories ?? [];
  const summary = summarizeCategories(categories);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-gray-600">Organize suas transações por categorias</p>
        </div>
        <Button onClick={() => setDialog({ open: true })} className="h-9 px-3">
          <Plus className="size-4" />
          Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard icon={<Tag className="size-6 text-gray-700" />} value={summary.categoryCount} label="Total de categorias" />
        <SummaryCard
          icon={<ArrowUpDown className="size-6 text-purple-base" />}
          value={summary.transactionCount}
          label="Total de transações"
        />
        <SummaryCard
          icon={
            summary.mostUsed &&
            createElement(categoryIcon(summary.mostUsed.icon), {
              className: cn("size-6", categoryColor(summary.mostUsed.color).soft, "bg-transparent"),
            })
          }
          value={summary.mostUsed?.title ?? "—"}
          label="Categoria mais utilizada"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col gap-5 rounded-xl border bg-white p-6">
            <div className="flex items-start justify-between">
              <CategoryIcon category={category} />
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label={`Excluir ${category.title}`}
                  onClick={() => setToDelete(category)}
                  className="flex size-8 items-center justify-center rounded-lg border bg-white text-danger hover:bg-gray-100"
                >
                  <Trash className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Editar ${category.title}`}
                  onClick={() => setDialog({ open: true, category })}
                  className="flex size-8 items-center justify-center rounded-lg border bg-white text-gray-700 hover:bg-gray-100"
                >
                  <SquarePen className="size-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <h2 className="font-semibold text-gray-800">{category.title}</h2>
              {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <CategoryTag category={category} />
              <span>
                {category.transactionCount} {category.transactionCount === 1 ? "item" : "itens"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDeleteDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${toDelete?.title}"? Essa ação não pode ser desfeita.`}
        onConfirm={() => deleteCategory({ variables: { id: toDelete!.id } })}
      />

      <CategoryDialog
        open={dialog.open}
        category={dialog.category}
        onOpenChange={(open) => setDialog((current) => ({ ...current, open }))}
      />
    </div>
  );
}

function SummaryCard({ icon, value, label }: { icon: ReactNode; value: ReactNode; label: string }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border bg-white p-6">
      <span className="pt-1.5">{icon}</span>
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">{label}</span>
      </div>
    </div>
  );
}
