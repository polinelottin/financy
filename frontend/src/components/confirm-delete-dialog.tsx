import { useState } from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => Promise<unknown>;
};

export function ConfirmDeleteDialog({ open, onOpenChange, title, description, onConfirm }: ConfirmDeleteDialogProps) {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setError("");
    setDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setError("");
        onOpenChange(value);
      }}
    >
      <DialogContent className="gap-6 p-6 sm:max-w-112">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-800">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">{description}</DialogDescription>
        </DialogHeader>
        {error && (
          <p role="alert" className="rounded-lg bg-red-light px-4 py-3 text-sm text-red-dark">
            {error}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <DialogClose asChild>
            <Button variant="outline" className="h-12 bg-white text-base text-gray-700">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={deleting}
            className="h-12 bg-danger text-base text-white hover:bg-red-dark"
          >
            <Trash className="size-4.5" />
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
