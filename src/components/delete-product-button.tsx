"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

type DeleteProductButtonProps = {
  product: Product;
  className?: string;
};

export function DeleteProductButton({
  product,
  className,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Eliminar "${product.descripcion}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Error al eliminar");
      }

      toast.success("Prenda eliminada");
      router.push("/panel");
      router.refresh();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Error al eliminar la prenda"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className={cn(
        "text-red-600 hover:bg-red-50 hover:text-red-700",
        className
      )}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
      Eliminar
    </Button>
  );
}
