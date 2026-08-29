import { LoginForm } from "@/components/login-form";
import { Barcode, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#fecdd3_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#fde68a_0%,transparent_40%),linear-gradient(135deg,#fafaf9_0%,#f5f5f4_100%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-stone-900 text-white">
              <Barcode className="size-6" />
            </div>
            <div>
              <p className="font-heading text-2xl font-semibold text-stone-900">
                ModaLabel
              </p>
              <p className="text-sm text-stone-600">Gestión de códigos de prenda</p>
            </div>
          </div>

          <div className="max-w-md space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-rose-600 shadow-sm ring-1 ring-black/5">
              <Sparkles className="size-4" />
              Inspirado en e-commerce moderno
            </div>
            <h1 className="font-heading text-5xl font-semibold leading-tight text-stone-900">
              Etiquetas inteligentes para tu colección
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Genera códigos de barras únicos por prenda, personaliza cada
              producto con tus fotos y prepáralo para lucir en tu futura web
              comercial.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "Año", label: "Temporada" },
              { value: "Foto", label: "Personalizable" },
              { value: "CODE128", label: "Compatible" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white/60 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur"
              >
                <p className="font-heading text-xl font-semibold text-stone-900">
                  {item.value}
                </p>
                <p className="text-sm text-stone-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2 lg:hidden">
            <div className="flex items-center gap-2">
              <Barcode className="size-6 text-stone-900" />
              <span className="font-heading text-2xl font-semibold">ModaLabel</span>
            </div>
            <p className="text-stone-600">Ingresa para gestionar tus códigos</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-3xl font-semibold text-stone-900">
              Bienvenido
            </h2>
            <p className="text-stone-600">
              Acceso exclusivo para el equipo de la tienda
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
