import { createFileRoute } from "@tanstack/react-router";
import { Banknote, CreditCard, ArrowLeftRight, Lock, Printer } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/topbar";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { money, movimientosCaja } from "@/lib/pos-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/caja")({
  head: () => ({
    meta: [
      { title: "Control de caja — Aurea POS" },
      {
        name: "description",
        content: "Apertura, movimientos, arqueo y cierre de caja por turno.",
      },
      { property: "og:title", content: "Control de caja — Aurea POS" },
      {
        property: "og:description",
        content: "Gestiona apertura, retiros, arqueo y cierre de turno.",
      },
    ],
  }),
  component: CajaPage,
});

function CajaPage() {
  const esperado = movimientosCaja.reduce((s, m) => s + m.monto, 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Caja"
        description="Turno matutino · Caja 01 · Abierta desde las 08:00"
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl">
              <Printer className="size-4" /> Imprimir corte
            </Button>
            <Button
              className="gap-2 rounded-xl"
              onClick={() => toast.success("Caja cerrada correctamente")}
            >
              <Lock className="size-4" /> Cerrar caja
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Efectivo en caja" value={money(esperado)} icon={Banknote} hint="esperado" />
        <StatCard label="Cobros con tarjeta" value={money(1842.6)} delta={6.8} icon={CreditCard} />
        <StatCard label="Transferencias" value={money(1067.5)} delta={2.1} icon={ArrowLeftRight} />
        <StatCard label="Diferencia" value={money(0)} icon={Lock} hint="sin descuadre" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <h2 className="text-base font-semibold">Movimientos del turno</h2>
          <p className="text-xs text-muted-foreground">Entradas y salidas de efectivo</p>
          <div className="mt-4 divide-y divide-border">
            {movimientosCaja.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-3">
                <span className="numeric w-12 text-xs text-muted-foreground">{m.hora}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.concepto}</p>
                  <p className="text-xs text-muted-foreground">{m.tipo}</p>
                </div>
                <span
                  className={cn(
                    "numeric text-sm font-semibold",
                    m.monto < 0 ? "text-destructive" : "text-success",
                  )}
                >
                  {m.monto < 0 ? "−" : "+"} {money(Math.abs(m.monto))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel flex flex-col p-5">
          <h2 className="text-base font-semibold">Arqueo de caja</h2>
          <p className="text-xs text-muted-foreground">Conteo físico al cierre</p>

          <div className="mt-4 space-y-3">
            {["Billetes", "Monedas", "Vales"].map((l) => (
              <div key={l} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{l}</Label>
                <Input placeholder="0.00" className="numeric h-10 rounded-xl text-right" />
              </div>
            ))}
          </div>

          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Esperado</span>
              <span className="numeric font-medium">{money(esperado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contado</span>
              <span className="numeric font-medium">{money(0)}</span>
            </div>
          </div>
          <Button
            className="mt-4 h-11 rounded-xl"
            onClick={() => toast.success("Arqueo guardado")}
          >
            Confirmar arqueo
          </Button>
        </div>
      </div>
    </div>
  );
}
