import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Filter, Download, Eye } from "lucide-react";

import { PageHeader } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { money, productos, ventas, type Venta } from "@/lib/pos-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ventas")({
  head: () => ({
    meta: [
      { title: "Ventas y tickets — Aurea POS" },
      {
        name: "description",
        content: "Historial de ventas con filtros por estado, método de pago y detalle del ticket.",
      },
      { property: "og:title", content: "Ventas y tickets — Aurea POS" },
      {
        property: "og:description",
        content: "Consulta, filtra y revisa el detalle de cada ticket emitido.",
      },
    ],
  }),
  component: VentasPage,
});

const estadoClass: Record<Venta["estado"], string> = {
  Completada: "bg-success/12 text-success",
  Pendiente: "bg-warning/16 text-warning-foreground",
  Reembolsada: "bg-destructive/12 text-destructive",
};

function VentasPage() {
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("Todas");
  const [detalle, setDetalle] = useState<Venta | null>(null);

  const filtradas = ventas.filter(
    (v) =>
      (estado === "Todas" || v.estado === estado) &&
      (v.id.toLowerCase().includes(q.toLowerCase()) ||
        v.cliente.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Ventas"
        description="Historial de tickets emitidos en la sucursal."
        actions={
          <Button variant="outline" className="gap-2 rounded-xl">
            <Download className="size-4" /> Exportar CSV
          </Button>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={estado} onValueChange={setEstado}>
          <TabsList className="rounded-xl">
            {["Todas", "Completada", "Pendiente", "Reembolsada"].map((e) => (
              <TabsTrigger key={e} value={e} className="rounded-lg text-xs sm:text-sm">
                {e}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar ticket o cliente"
              className="h-10 rounded-xl bg-card pl-9 lg:w-72"
            />
          </div>
          <Button variant="outline" size="icon" className="size-10 rounded-xl">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Ticket</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              <TableHead className="hidden md:table-cell">Cliente</TableHead>
              <TableHead className="hidden lg:table-cell">Artículos</TableHead>
              <TableHead className="hidden sm:table-cell">Método</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.map((v) => (
              <TableRow key={v.id} className="cursor-pointer" onClick={() => setDetalle(v)}>
                <TableCell className="numeric font-medium">{v.id}</TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{v.fecha}</TableCell>
                <TableCell className="hidden md:table-cell">{v.cliente}</TableCell>
                <TableCell className="numeric hidden lg:table-cell">{v.items}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary" className="rounded-full font-normal">
                    {v.metodo}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      estadoClass[v.estado],
                    )}
                  >
                    {v.estado}
                  </span>
                </TableCell>
                <TableCell className="numeric text-right font-semibold">{money(v.total)}</TableCell>
                <TableCell className="w-10">
                  <Eye className="size-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!detalle} onOpenChange={(o) => !o && setDetalle(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="numeric">{detalle?.id}</SheetTitle>
            <SheetDescription>
              {detalle?.cliente} · {detalle?.fecha}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4">
            <div className="space-y-2">
              {productos.slice(0, detalle?.items ? Math.min(detalle.items, 4) : 2).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl bg-surface p-2.5">
                  <span className="grid size-9 place-items-center rounded-lg bg-card text-base">
                    {p.emoji}
                  </span>
                  <p className="flex-1 truncate text-sm">{p.nombre}</p>
                  <span className="numeric text-sm font-medium">{money(p.precio)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Total pagado</span>
              <span className="numeric text-xl font-semibold">{money(detalle?.total ?? 0)}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl">Reimprimir</Button>
              <Button variant="outline" className="flex-1 rounded-xl text-destructive">
                Reembolsar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
