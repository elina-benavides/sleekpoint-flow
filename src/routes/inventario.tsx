import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, PackageCheck, PackagePlus, PackageMinus, ClipboardCheck, Boxes, Search } from "lucide-react";

import { PageHeader } from "@/components/topbar";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { money } from "@/lib/pos-data";
import { useInventory } from "@/lib/inventory-store";
import { useBusinessUI } from "@/lib/business-ui-store";
import { supportsProductLocations, formatLocation } from "@/lib/product-location";
import { MovementDialog, type FormKind } from "@/components/inventory/movement-dialog";
import { MovementHistory } from "@/components/inventory/movement-history";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Existencias en tiempo real, alertas de reposición y valorización.",
      },
    ],
  }),
  component: InventarioPage,
});

function InventarioPage() {
  const { products: productos, movements } = useInventory();
  const { businessType, locations } = useBusinessUI();
  const showLocations = supportsProductLocations(businessType);
  const [form, setForm] = useState<FormKind | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [category, setCategory] = useState("Todos");
  const bajos = productos.filter((p) => p.stock <= p.stockMin);
  const valor = productos.reduce((s, p) => s + p.stock * p.costo, 0);
  const lista = productos.filter((p) => `${p.nombre} ${p.sku}`.toLowerCase().includes(query.toLowerCase()) && (category === "Todos" || p.categoria === category) && (filter === "Todos" || (filter === "Bajo" ? p.stock <= p.stockMin : p.stock === 0)));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Inventario"
        description="Existencias, movimientos y conteo físico."
        actions={
          <>
            <Button className="h-11 gap-2 rounded-xl" onClick={() => setForm("Entrada")}><PackagePlus className="size-4" /> Entrada</Button>
            <Button variant="outline" className="h-11 gap-2 rounded-xl" onClick={() => setForm("Salida")}><PackageMinus className="size-4" /> Salida</Button>
            <Button variant="outline" className="h-11 gap-2 rounded-xl" onClick={() => setForm("Conteo")}><ClipboardCheck className="size-4" /> Conteo y cuadre</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="SKUs activos" value={String(productos.length)} icon={Boxes} hint="en catálogo" />
        <StatCard label="Valor inventario" value={money(valor)} delta={3.2} icon={PackageCheck} />
        <StatCard label="Stock bajo" value={String(bajos.length)} icon={AlertTriangle} hint="requieren compra" />
        <StatCard label="Movimientos" value={String(movements.length)} icon={PackagePlus} hint="en esta sesión" />
      </div>

      <p className="text-xs text-muted-foreground">Datos de demostración · Los cambios se conservan únicamente durante esta sesión.</p>
      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList className="h-10"><TabsTrigger value="stock">Existencias</TabsTrigger><TabsTrigger value="movements">Movimientos{movements.length > 0 ? ` (${movements.length})` : ""}</TabsTrigger></TabsList>
        <TabsContent value="stock" className="space-y-4">
      {bajos.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 sm:flex-row sm:items-center">
          <AlertTriangle className="size-5 shrink-0 text-warning" />
          <p className="flex-1 text-sm">
            <span className="font-medium">{bajos.length} productos</span> están por debajo del stock
            mínimo: {bajos.map((b) => b.nombre).join(", ")}.
          </p>
          <Button size="sm" variant="outline" className="rounded-lg bg-card" onClick={() => setFilter("Bajo")}>
            Ver productos
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Buscar existencias" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o SKU…" className="h-10 bg-card pl-9" /></div><Select value={category} onValueChange={setCategory}><SelectTrigger aria-label="Categoría de existencias" className="w-full bg-card sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Todos">Todas las categorías</SelectItem>{[...new Set(productos.map((p) => p.categoria))].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><Select value={filter} onValueChange={setFilter}><SelectTrigger aria-label="Estado de existencias" className="w-full bg-card sm:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Todos">Todos los estados</SelectItem><SelectItem value="Bajo">Stock bajo</SelectItem><SelectItem value="Agotado">Agotados</SelectItem></SelectContent></Select></div>
      <div className="panel hidden overflow-hidden md:block">
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
            {lista.map((p) => {
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
                      <div><span className="font-medium">{p.nombre}</span>{showLocations && <p className="text-xs text-muted-foreground">{formatLocation(locations[p.id])}</p>}</div>
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
      <div className="panel divide-y overflow-hidden md:hidden">{lista.map((p) => <div key={p.id} className="flex items-center gap-3 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface text-xl">{p.emoji}</span><div className="min-w-0 flex-1"><p className="text-sm font-medium">{p.nombre}</p><p className="text-xs text-muted-foreground">{p.sku} · Mín. {p.stockMin}</p>{showLocations && <p className="mt-1 text-xs text-muted-foreground">{formatLocation(locations[p.id])}</p>}</div><div className="shrink-0 text-right"><p className="numeric text-sm font-semibold">{p.stock} u.</p><p className={cn("text-xs", p.stock <= p.stockMin ? "text-destructive" : "text-success")}>{p.stock === 0 ? "Agotado" : p.stock <= p.stockMin ? "Stock bajo" : "Disponible"}</p></div></div>)}</div>
      {!lista.length && <p className="py-10 text-center text-sm text-muted-foreground">No hay productos coincidentes.</p>}
      </TabsContent>
      <TabsContent value="movements"><MovementHistory /></TabsContent>
      </Tabs>
      {form && <MovementDialog key={form} kind={form} onClose={() => setForm(null)} />}
    </div>
  );
}
