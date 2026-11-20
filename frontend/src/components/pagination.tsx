import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-700">
      <span>
        {first} a {last} | {total} resultados
      </span>
      <div className="flex gap-2">
        <PageButton disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="Página anterior">
          <ChevronLeft className="size-4" />
        </PageButton>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
          <PageButton key={number} active={number === page} onClick={() => onPageChange(number)}>
            {number}
          </PageButton>
        ))}
        <PageButton disabled={page === pageCount} onClick={() => onPageChange(page + 1)} aria-label="Próxima página">
          <ChevronRight className="size-4" />
        </PageButton>
      </div>
    </div>
  );
}

function PageButton({ active, className, ...props }: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-8 items-center justify-center rounded-lg border text-sm disabled:opacity-40",
        active ? "border-brand-base bg-brand-base text-white" : "bg-white text-gray-700 hover:bg-gray-100",
        className,
      )}
      {...props}
    />
  );
}
