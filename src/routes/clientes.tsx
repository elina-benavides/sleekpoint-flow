import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, UserPlus, Mail, Phone, Star } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/topbar";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { money } from "@/lib/pos-data";
import { useClientes } from "@/lib/clientes-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes y fidelidad — Aurea POS" },
      {
        name: "description",
        content: "Directorio de clientes con historial de compras, gasto acumulado y nivel de fidelidad.",
      },
      { property: "og:title", content: "Clientes y fidelidad — Aurea POS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Directorio con historial de compras y niveles de fidelidad.",
      },
    ],
  }),
  component: ClientesPage,
});

const nivelClass = {
  VIP: "bg-primary/12 text-primary",
  Frecuente: "bg-info/12 text-info",
  Nuevo: "bg-muted text-muted-foreground",
} as const;

function ClientesPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const clientes = useClientes();
  const lista = clientes.filter((c) => c.nombre.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Clientes"
        description="Directorio y programa de fidelidad."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl">
                <UserPlus className="size-4" /> Nuevo cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {["Nombre completo", "Correo electrónico", "Teléfono", "RFC (opcional)"].map((l) => (
                  <div key={l} className="space-y-2">
                    <Label>{l}</Label>
                    <Input className="rounded-xl" />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    setOpen(false);
                    toast.success("Cliente registrado");
                  }}
                >
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Clientes totales" value="1,248" delta={4.2} icon={UserPlus} />
        <StatCard label="Clientes VIP" value="86" delta={9.5} icon={Star} />
        <StatCard label="Gasto promedio" value={money(184.3)} delta={-1.4} icon={Mail} />
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar cliente"
          className="h-10 rounded-xl bg-card pl-9"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lista.map((c) => (
          <div key={c.id} className="panel p-5">
            <div className="flex items-start gap-3">
              <Avatar className="size-11">
                <AvatarFallback className="bg-surface text-sm font-semibold">
                  {c.nombre
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{c.nombre}</p>
                <p className="truncate text-xs text-muted-foreground">{c.email}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  nivelClass[c.nivel],
                )}
              >
                {c.nivel}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="size-3.5" /> {c.telefono}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Compras</p>
                <p className="numeric text-lg font-semibold">{c.compras}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gastado</p>
                <p className="numeric text-lg font-semibold">{money(c.gastado)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
