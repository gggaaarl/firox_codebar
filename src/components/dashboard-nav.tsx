"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Barcode, LayoutGrid, LogOut, Plus } from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();
  const isPanel = pathname === "/panel" || pathname.startsWith("/panel/");

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Link href="/panel" className="flex min-w-0 items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white">
              <Barcode className="size-5" />
            </div>
            <p className="truncate font-heading text-lg font-semibold text-stone-900">
              Firox
            </p>
          </Link>

          <Link
            href="/panel"
            className={cn(
              "hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:flex",
              isPanel && pathname === "/panel"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            )}
          >
            <LayoutGrid className="size-4" />
            Productos
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/panel/nuevo"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-rose-500 hover:bg-rose-600"
            )}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nuevo producto</span>
            <span className="sm:hidden">Nueva</span>
          </Link>
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
