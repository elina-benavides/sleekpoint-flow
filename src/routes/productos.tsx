import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categorias, money, productos } from "@/lib/pos-data";

export const Route = createFileRoute("/productos")({
  head: () => ({
    meta: [
      { title: "Catálogo de productos — Aurea POS" },
      {
        name: "description",
        content: "Administra productos, precios, costos, categorías y márgenes del catálogo.",
      },
      { property: "og:title", content: "Catálogo de productos — Aurea POS" },
      {
        property: "og:description",
        content: "Alta, edición y control de precios y márgenes de todo el catálogo.",
      },
    ],
  }),
  component: ProductosPage,
});

function ProductosPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const lista = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(q.toLowerCase()) ||
      p.sku.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Productos"
        description={`${productos.length} artículos activos en el catálogo.`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl">
                <Plus className="size-4" /> Nuevo producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nuevo producto</DialogTitle>
                <DialogDescription>
                  Completa la información básica para publicarlo en el punto de venta.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" placeholder="Latte de avellana" full />
                <Field label="SKU" placeholder="CAF-005" />
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select defaultValue="Café">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.slice(1).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Field label="Precio de venta" placeholder="0.00" />
                <Field label="Costo" placeholder="0.00" />
                <Field label="Stock inicial" placeholder="0" />
                <Field label="Stock mínimo" placeholder="0" />
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    setOpen(false);
                    toast.success("Producto creado");
                  }}
                >
                  Guardar producto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o SKU"
          className="h-10 rounded-xl bg-card pl-9"
        />
      </div>

      <div className="panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Producto</TableHead>
              <TableHead className="hidden sm:table-cell">SKU</TableHead>
              <TableHead className="hidden md:table-cell">Categoría</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="hidden text-right lg:table-cell">Costo</TableHead>
              <TableHead className="hidden text-right lg:table-cell">Margen</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lista.map((p) => (
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
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary" className="rounded-full font-normal">
                    {p.categoria}
                  </Badge>
                </TableCell>
                <TableCell className="numeric text-right font-semibold">{money(p.precio)}</TableCell>
                <TableCell className="numeric hidden text-right text-muted-foreground lg:table-cell">
                  {money(p.costo)}
                </TableCell>
                <TableCell className="numeric hidden text-right text-success lg:table-cell">
                  {Math.round(((p.precio - p.costo) / p.precio) * 100)}%
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="size-8 rounded-lg">
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 rounded-lg text-destructive">
                    <Trash2 className="size-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  full,
}: {
  label: string;
  placeholder: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "space-y-2 sm:col-span-2" : "space-y-2"}>
      <Label>{label}</Label>
      <Input placeholder={placeholder} className="rounded-xl" />
    </div>
  );
}
