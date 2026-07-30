import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  
  CreditCard,
  Banknote,
  QrCode,
  Percent,
  Pause,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { categorias, money, productos, type Cliente, type Product } from "@/lib/pos-data";
import { CustomerPicker } from "@/components/pos/customer-picker";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Punto de venta — Aurea POS" },
      {
        name: "description",
        content:
          "Terminal de venta rápida: catálogo, carrito, descuentos y cobro en efectivo, tarjeta o transferencia.",
      },
      { property: "og:title", content: "Punto de venta — Aurea POS" },
      {
        property: "og:description",
        content: "Terminal de venta rápida con catálogo, carrito y cobro multimétodo.",
      },
    ],
  }),
  component: POSPage,
});

type Linea = { producto: Product; cantidad: number };

function POSPage() {
  const [categoria, setCategoria] = useState<string>("Todos");
  const [query, setQuery] = useState("");
  const [carrito, setCarrito] = useState<Linea[]>([
    { producto: productos[0], cantidad: 2 },
    { producto: productos[4], cantidad: 1 },
  ]);
  const [cliente, setCliente] = useState<Cliente | null>(null);

  const filtrados = useMemo(
    () =>
      productos.filter(
        (p) =>
          (categoria === "Todos" || p.categoria === categoria) &&
          (p.nombre.toLowerCase().includes(query.toLowerCase()) ||
            p.sku.toLowerCase().includes(query.toLowerCase())),
      ),
    [categoria, query],
  );

  const add = (producto: Product) =>
    setCarrito((prev) => {
      const found = prev.find((l) => l.producto.id === producto.id);
      return found
        ? prev.map((l) =>
            l.producto.id === producto.id ? { ...l, cantidad: l.cantidad + 1 } : l,
          )
        : [...prev, { producto, cantidad: 1 }];
    });

  const step = (id: string, delta: number) =>
    setCarrito((prev) =>
      prev
        .map((l) => (l.producto.id === id ? { ...l, cantidad: l.cantidad + delta } : l))
        .filter((l) => l.cantidad > 0),
    );

  const subtotal = carrito.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
  const descuento = subtotal * 0.05;
  const impuesto = (subtotal - descuento) * 0.16;
  const total = subtotal - descuento + impuesto;

  const ticket = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold">Ticket actual</p>
          <p className="truncate text-xs text-muted-foreground">
            #TKT-10483 · Caja 01 · {cliente ? cliente.nombre : "Mostrador"}
          </p>
        </div>
        <CustomerPicker cliente={cliente} onChange={setCliente} />
      </div>


      <ScrollArea className="mt-4 flex-1 px-5">
        {carrito.length === 0 ? (
          <div className="grid h-40 place-items-center text-sm text-muted-foreground">
            Agrega productos al ticket
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {carrito.map((l) => (
              <div
                key={l.producto.id}
                className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface/60 p-2.5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card text-lg">
                  {l.producto.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.producto.nombre}</p>
                  <p className="numeric text-xs text-muted-foreground">
                    {money(l.producto.precio)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 rounded-md"
                    onClick={() => step(l.producto.id, -1)}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="numeric w-5 text-center text-sm font-medium">
                    {l.cantidad}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 rounded-md"
                    onClick={() => step(l.producto.id, 1)}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
                <span className="numeric w-16 text-right text-sm font-semibold">
                  {money(l.producto.precio * l.cantidad)}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-border p-5">
        <div className="space-y-1.5 text-sm">
          <Row label="Subtotal" value={money(subtotal)} />
          <Row label="Descuento (5%)" value={`− ${money(descuento)}`} muted />
          <Row label="IVA (16%)" value={money(impuesto)} muted />
        </div>
        <Separator className="my-3" />
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="numeric text-2xl font-semibold">{money(total)}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "Efectivo", icon: Banknote },
            { label: "Tarjeta", icon: CreditCard },
            { label: "QR", icon: QrCode },
          ].map((m) => (
            <button
              key={m.label}
              onClick={() => toast.success(`Cobro con ${m.label} · ${money(total)}`)}
              className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface/60 py-2.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <m.icon className="size-4 text-primary" />
              {m.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <Button variant="outline" className="h-11 flex-1 gap-1.5 rounded-xl">
            <Pause className="size-4" /> Suspender
          </Button>
          <Button
            className="h-11 flex-[2] rounded-xl text-base font-semibold"
            onClick={() => {
              toast.success("Venta completada", { description: money(total) });
              setCarrito([]);
              setCliente(null);
            }}
          >
            Cobrar {money(total)}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] min-w-0">
      <section className="flex min-w-0 flex-1 flex-col p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto o escanear código…"
              className="h-11 rounded-xl border-border bg-card pl-9"
            />
          </div>
          <Badge
            variant="secondary"
            className="hidden h-8 rounded-lg px-3 font-normal text-muted-foreground sm:inline-flex"
          >
            {filtrados.length} artículos
          </Badge>
        </div>

        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                categoria === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-surface",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <ScrollArea className="-mx-1 mt-4 flex-1 px-1">
          <div className="grid grid-cols-2 gap-3 pb-24 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filtrados.map((p) => (
              <button
                key={p.id}
                onClick={() => add(p)}
                className="panel group flex flex-col items-start p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="grid h-16 w-full place-items-center rounded-lg bg-surface text-3xl">
                  {p.emoji}
                </div>
                <p className="mt-2.5 line-clamp-1 text-sm font-medium">{p.nombre}</p>
                <p className="text-[0.7rem] text-muted-foreground">{p.sku}</p>
                <div className="mt-2 flex w-full items-center justify-between">
                  <span className="numeric text-sm font-semibold text-primary">
                    {money(p.precio)}
                  </span>
                  <span
                    className={cn(
                      "text-[0.7rem]",
                      p.stock <= p.stockMin ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {p.stock} u.
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </section>

      <aside className="hidden w-[26rem] shrink-0 border-l border-border bg-card lg:block">
        {ticket}
      </aside>

      <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="h-13 w-full justify-between rounded-2xl px-5 py-3.5 shadow-[var(--shadow-lift)]">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Percent className="size-4" />
                {carrito.reduce((s, l) => s + l.cantidad, 0)} artículos
              </span>
              <span className="numeric text-base font-semibold">{money(total)}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Ticket actual</SheetTitle>
            </SheetHeader>
            {ticket}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-muted-foreground", muted && "text-xs")}>{label}</span>
      <span className="numeric">{value}</span>
    </div>
  );
}
