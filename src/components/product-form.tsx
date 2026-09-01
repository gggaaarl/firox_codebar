"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarcodeDisplay } from "@/components/barcode-display";
import type { Product } from "@/lib/types";
import { Loader2 } from "lucide-react";

type ProductFormProps = {
  product?: Product;
  mode: "create" | "edit";
};

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();

  const [codSistema, setCodSistema] = useState(product?.codSistema ?? "");
  const [codLocal, setCodLocal] = useState(product?.codLocal ?? "");
  const [codigoBarra, setCodigoBarra] = useState(product?.codigoBarra ?? "");
  const [clase, setClase] = useState(product?.clase ?? "");
  const [descripcion, setDescripcion] = useState(product?.descripcion ?? "");
  const [marca, setMarca] = useState(product?.marca ?? "");
  const [color, setColor] = useState(product?.color ?? "");
  const [talla, setTalla] = useState(product?.talla ?? "");
  const [unidadMedida, setUnidadMedida] = useState(
    product?.unidadMedida ?? "UND"
  );
  const [precioVenta, setPrecioVenta] = useState(
    product?.precioVenta?.toString() ?? "0"
  );
  const [loading, setLoading] = useState(false);

  const previewBarcode = useMemo(() => codigoBarra.trim(), [codigoBarra]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        codSistema,
        codLocal,
        codigoBarra,
        clase,
        descripcion,
        marca,
        color,
        talla,
        unidadMedida,
        precioVenta: Number(precioVenta) || 0,
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
        throw new Error(data.error ?? "Error al guardar el producto");
      }

      toast.success(
        mode === "create"
          ? "Producto creado correctamente"
          : "Producto actualizado correctamente"
      );
      router.push(`/panel/${data.id}`);
      router.refresh();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Error al guardar el producto"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
      <Card className="border-0 bg-stone-900 text-white shadow-sm lg:order-2">
        <CardHeader>
          <CardTitle className="font-heading text-xl">
            Vista previa del código
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {previewBarcode ? (
            <div className="overflow-x-auto rounded-xl bg-white p-4">
              <BarcodeDisplay
                value={previewBarcode}
                className="mx-auto block h-auto max-w-full"
              />
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-stone-600 p-6 text-center text-sm text-stone-400">
              Ingresa el código de barras para ver la vista previa
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm ring-1 ring-black/5 lg:order-1">
        <CardHeader>
          <CardTitle className="font-heading text-xl">
            Datos del producto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="codSistema">Cod. sistema</Label>
              <Input
                id="codSistema"
                value={codSistema}
                onChange={(e) => setCodSistema(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codLocal">Cod. local</Label>
              <Input
                id="codLocal"
                value={codLocal}
                onChange={(e) => setCodLocal(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigoBarra">Código de barras</Label>
            <Input
              id="codigoBarra"
              value={codigoBarra}
              onChange={(e) => setCodigoBarra(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clase">Clase</Label>
            <Input
              id="clase"
              value={clase}
              onChange={(e) => setClase(e.target.value)}
              placeholder="Ej: CASACA, BOTAS"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="talla">Talla</Label>
              <Input
                id="talla"
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidadMedida">Unidad</Label>
              <Input
                id="unidadMedida"
                value={unidadMedida}
                onChange={(e) => setUnidadMedida(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precioVenta">Precio venta</Label>
              <Input
                id="precioVenta"
                type="number"
                min="0"
                step="0.01"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !codigoBarra.trim() || !descripcion.trim()}
              className="w-full bg-rose-500 hover:bg-rose-600 sm:flex-1"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "create" ? "Guardar producto" : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
