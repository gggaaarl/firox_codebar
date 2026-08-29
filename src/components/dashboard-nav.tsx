"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Barcode,
  LayoutGrid,
  LogOut,
  Plus,
  Sparkles,
  Store,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/panel", label: "Prendas", icon: LayoutGrid },
  { href: "/panel/nuevo", label: "Nueva prenda", icon: Plus },
  { href: "/panel/catalogo", label: "Vista comercial", icon: Store },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/panel" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-stone-900 text-white">
              <Barcode className="size-5" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold leading-none text-stone-900">
                ModaLabel
              </p>
              <p className="text-xs text-stone-500">Códigos de prenda</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== "/panel" && pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-stone-900 text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 sm:flex">
            <Sparkles className="size-3.5" />
            Demo web comercial
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-stone-600"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
