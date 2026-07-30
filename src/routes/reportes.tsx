import { createFileRoute } from "@tanstack/react-router";
import { Download, TrendingUp, DollarSign, ReceiptText, Percent } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/topbar";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mixCategorias, money, productos, ventasSemana } from "@/lib/pos-data";

export const Route = createFileRoute("/reportes")({
  head: () => ({
    meta: [
      { title: "Reportes y analítica — Aurea POS" },
      {
        name: "description",
        content: "Analítica de ventas, mix de categorías, márgenes y rendimiento por producto.",
      },
      { property: "og:title", content: "Reportes y analítica — Aurea POS" },
      {
        property: "og:description",
        content: "Analítica de ventas, márgenes y mix de categorías.",
      },
    ],
  }),
  component: ReportesPage,
});

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.75rem",
  fontSize: 12,
};

function ReportesPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Reportes"
        description="Analítica del periodo seleccionado."
        actions={
          <>
            <Tabs defaultValue="7d">
              <TabsList className="rounded-xl">
                {["7d", "30d", "90d", "Año"].map((t) => (
                  <TabsTrigger key={t} value={t} className="rounded-lg text-xs">
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button variant="outline" className="gap-2 rounded-xl">
              <Download className="size-4" /> PDF
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ingresos" value={money(17420)} delta={11.2} icon={DollarSign} hint="7 días" />
        <StatCard label="Tickets" value="907" delta={6.4} icon={ReceiptText} hint="7 días" />
        <StatCard label="Margen bruto" value="62.4%" delta={1.8} icon={Percent} />
        <StatCard label="Crecimiento" value="+9.7%" delta={9.7} icon={TrendingUp} hint="vs. semana previa" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <h2 className="text-base font-semibold">Ingresos vs. tickets</h2>
          <p className="text-xs text-muted-foreground">Comparativa diaria de la semana</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ventasSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="dia" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis yAxisId="l" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" width={45} />
                <YAxis yAxisId="r" orientation="right" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" width={35} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="l" type="monotone" dataKey="ventas" name="Ingresos" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
                <Line yAxisId="r" type="monotone" dataKey="tickets" name="Tickets" stroke="var(--color-chart-4)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-base font-semibold">Mix de categorías</h2>
          <p className="text-xs text-muted-foreground">Participación en ingresos</p>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mixCategorias}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  stroke="none"
                >
                  {mixCategorias.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {mixCategorias.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: chartColors[i % chartColors.length] }}
                />
                <span className="flex-1 text-muted-foreground">{c.name}</span>
                <span className="numeric font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel p-5">
        <h2 className="text-base font-semibold">Rendimiento por producto</h2>
        <p className="text-xs text-muted-foreground">Ingresos estimados del periodo</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={productos.slice(0, 8).map((p, i) => ({
                nombre: p.nombre.split(" ")[0],
                ingresos: Math.round(p.precio * (140 - i * 12)),
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="nombre" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" width={45} />
              <Tooltip cursor={{ fill: "var(--color-surface)" }} contentStyle={tooltipStyle} />
              <Bar dataKey="ingresos" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
