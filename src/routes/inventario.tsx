import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, PackageCheck, PackagePlus, Boxes } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/topbar";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { money, productos } from "@/lib/pos-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inventario")({
  head: () => ({
    meta: [
      { title: "Inventario y stock — Aurea POS" },
      {
        name: "description",
        content: "Control de existencias, alertas de stock bajo y valor total del inventario.",
      },
      { property: "og:title", content: "Inventario y stock — Aurea POS" },
      {
        property: "og:description",
        content: "Existencias en tiempo real, alertas de reposición y valorización.",
      },
    ],
  }),
  component: InventarioPage,
});

function InventarioPage() {
  const bajos = productos.filter((p) => p.stock <= p.stockMin);
  const valor = productos.reduce((s, p) => s + p.stock * p.costo, 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Inventario"
        description="Existencias por producto y alertas de reposición."
        actions={
          <Button className="gap-2 rounded-xl" onClick={() => toast.success("Ajuste registrado")}>
            <PackagePlus className="size-4" /> Registrar entrada
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="SKUs activos" value={String(productos.length)} icon={Boxes} hint="en catálogo" />
        <StatCard label="Valor inventario" value={money(valor)} delta={3.2} icon={PackageCheck} />
        <StatCard label="Stock bajo" value={String(bajos.length)} icon={AlertTriangle} hint="requieren compra" />
        <StatCard label="Rotación mensual" value="4.8x" delta={1.1} icon={PackagePlus} />
      </div>

      {bajos.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 sm:flex-row sm:items-center">
          <AlertTriangle className="size-5 shrink-0 text-warning" />
          <p className="flex-1 text-sm">
            <span className="font-medium">{bajos.length} productos</span> están por debajo del stock
            mínimo: {bajos.map((b) => b.nombre).join(", ")}.
          </p>
          <Button size="sm" variant="outline" className="rounded-lg bg-card">
            Generar orden de compra
          </Button>
        </div>
      )}

      <div className="panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Producto</TableHead>
              <TableHead className="hidden sm:table-cell">SKU</TableHead>
              <TableHead className="w-48">Nivel de stock</TableHead>
              <TableHead className="text-right">Disponible</TableHead>
              <TableHead className="hidden text-right md:table-cell">Mínimo</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((p) => {
              const pct = Math.min(100, (p.stock / (p.stockMin * 3)) * 100);
              const bajo = p.stock <= p.stockMin;
              const medio = !bajo && p.stock <= p.stockMin * 1.8;
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-lg bg-surface text-base">
                        {p.emoji}
                      </span>
                      <span className="font-medium">{p.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="numeric hidden text-muted-foreground sm:table-cell">
                    {p.sku}
                  </TableCell>
                  <TableCell>
                    <Progress
                      value={pct}
                      className={cn(
                        "h-2",
                        bajo
                          ? "[&>div]:bg-destructive"
                          : medio
                            ? "[&>div]:bg-warning"
                            : "[&>div]:bg-success",
                      )}
                    />
                  </TableCell>
                  <TableCell className="numeric text-right font-semibold">{p.stock}</TableCell>
                  <TableCell className="numeric hidden text-right text-muted-foreground md:table-cell">
                    {p.stockMin}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        bajo
                          ? "bg-destructive/12 text-destructive"
                          : medio
                            ? "bg-warning/16 text-warning-foreground"
                            : "bg-success/12 text-success",
                      )}
                    >
                      {bajo ? "Crítico" : medio ? "Bajo" : "Óptimo"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
