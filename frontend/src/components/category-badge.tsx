import { createElement } from "react";
import { categoryColor, categoryIcon } from "@/lib/category-style";
import { cn } from "@/lib/utils";

type Category = { title: string; icon: string; color: string };

export function CategoryTag({ category }: { category: Category }) {
  return (
    <span className={cn("rounded-full px-3 py-1 text-sm font-medium", categoryColor(category.color).soft)}>
      {category.title}
    </span>
  );
}

export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg",
        categoryColor(category.color).soft,
        className,
      )}
    >
      {createElement(categoryIcon(category.icon), { className: "size-4" })}
    </span>
  );
}
