import { createFileRoute } from "@tanstack/react-router";
import {
  DollarSign,
  ReceiptText,
  Users,
  TrendingUp,
  Download,
  CalendarDays,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/topbar";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { money, productos, ventas, ventasPorHora, ventasSemana } from "@/lib/pos-data";

export const Route = createFileRoute("/panel")({
  head: () => ({
    meta: [
      { title: "Panel de control — Aurea POS" },
      {
        name: "description",
        content: "Métricas del día: ventas, tickets, ticket promedio y productos más vendidos.",
      },
      { property: "og:title", content: "Panel de control — Aurea POS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Métricas en vivo de ventas, tickets y desempeño de la sucursal.",
      },
    ],
  }),
  component: PanelPage,
});

function PanelPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Panel de control"
        description="Resumen operativo de hoy, jueves 30 de julio."
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl">
              <CalendarDays className="size-4" /> Hoy
            </Button>
            <Button className="gap-2 rounded-xl">
              <Download className="size-4" /> Exportar
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ventas del día" value={money(3689.4)} delta={12.4} icon={DollarSign} hint="vs. ayer" />
        <StatCard label="Tickets" value="164" delta={8.1} icon={ReceiptText} hint="vs. ayer" />
        <StatCard label="Ticket promedio" value={money(22.5)} delta={-2.3} icon={TrendingUp} hint="vs. ayer" />
        <StatCard label="Clientes nuevos" value="19" delta={5.6} icon={Users} hint="esta semana" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Ventas por hora</h2>
              <p className="text-xs text-muted-foreground">Ingresos acumulados durante la jornada</p>
            </div>
            <Badge className="rounded-full bg-success/12 text-success hover:bg-success/12">En vivo</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ventasPorHora}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="hora" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" width={40} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.75rem",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#fill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-base font-semibold">Más vendidos</h2>
          <p className="text-xs text-muted-foreground">Top del día por unidades</p>
          <div className="mt-4 space-y-3">
            {productos.slice(0, 6).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="numeric w-4 text-xs text-muted-foreground">{i + 1}</span>
                <span className="grid size-9 place-items-center rounded-lg bg-surface text-base">
                  {p.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.nombre}</p>
                  <p className="text-xs text-muted-foreground">{90 - i * 11} unidades</p>
                </div>
                <span className="numeric text-sm font-semibold">
                  {money(p.precio * (90 - i * 11))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <h2 className="text-base font-semibold">Últimos tickets</h2>
          <div className="mt-4 divide-y divide-border">
            {ventas.slice(0, 5).map((v) => (
              <div key={v.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="numeric text-sm font-medium">{v.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {v.cliente} · {v.fecha}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full text-xs font-normal">
                  {v.metodo}
                </Badge>
                <span className="numeric w-20 text-right text-sm font-semibold">
                  {money(v.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-base font-semibold">Semana</h2>
          <p className="text-xs text-muted-foreground">Ingresos por día</p>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventasSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="dia" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  cursor={{ fill: "var(--color-surface)" }}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.75rem",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="ventas" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
