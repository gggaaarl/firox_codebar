"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload";
import { BarcodeDisplay } from "@/components/barcode-display";
import { generateBarcodeValue } from "@/lib/barcode";
import type { Gender, Product } from "@/lib/types";
import { Loader2, Sparkles } from "lucide-react";

const GENDERS: Gender[] = ["Hombre", "Mujer", "Unisex"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Única"];

type ProductFormProps = {
  product?: Product;
  mode: "create" | "edit";
};

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const currentYear = new Date().getFullYear().toString();

  const [year, setYear] = useState(product?.year ?? currentYear);
  const [description, setDescription] = useState(product?.description ?? "");
  const [gender, setGender] = useState<Gender>(product?.gender ?? "Mujer");
  const [size, setSize] = useState(product?.size ?? "M");
  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.imageUrl ?? null
  );
  const [loading, setLoading] = useState(false);

  const previewBarcode = useMemo(() => {
    if (!description.trim()) return "";
    return generateBarcodeValue(year, description, gender, size);
  }, [year, description, gender, size]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        year,
        description,
        gender,
        size,
        imageUrl,
      };

      const response = await fetch(
        mode === "create" ? "/api/products" : `/api/products/${product?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Error al guardar la prenda");
      }

      toast.success(
        mode === "create"
          ? "Prenda creada correctamente"
          : "Prenda actualizada correctamente"
      );
      router.push(`/panel/${data.id}`);
      router.refresh();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Error al guardar la prenda"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <Card className="border-0 shadow-sm ring-1 ring-black/5">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Foto de la prenda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </CardContent>
        </Card>

        <Card className="border-0 bg-stone-900 text-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-xl">
              <Sparkles className="size-5 text-rose-400" />
              Vista previa del código
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-stone-300">
              Formato: año-descripción-sexo-talla
            </p>
            {previewBarcode ? (
              <div className="rounded-xl bg-white p-4">
                <BarcodeDisplay value={previewBarcode} />
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-stone-600 p-6 text-center text-sm text-stone-400">
                Completa los datos para ver el código de barras
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-black/5">
        <CardHeader>
          <CardTitle className="font-heading text-xl">
            Datos de la prenda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="year">Año</Label>
            <Input
              id="year"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              placeholder="2026"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ej: Polera básica algodón"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select
                value={gender}
                onValueChange={(value) =>
                  value && setGender(value as Gender)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Talla</Label>
              <Select
                value={size}
                onValueChange={(value) => value && setSize(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !description.trim()}
              className="flex-1 bg-rose-500 hover:bg-rose-600"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "create" ? "Generar código" : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
