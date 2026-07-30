import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, ShieldCheck, Clock, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usuarios } from "@/lib/pos-data";

export const Route = createFileRoute("/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuarios y permisos — Aurea POS" },
      {
        name: "description",
        content: "Gestión del equipo, roles, turnos y permisos de acceso al punto de venta.",
      },
      { property: "og:title", content: "Usuarios y permisos — Aurea POS" },
      {
        property: "og:description",
        content: "Administra roles, turnos y permisos del equipo de la tienda.",
      },
    ],
  }),
  component: UsuariosPage,
});

const permisos = [
  { rol: "Administrador", desc: "Acceso total, configuración y reportes financieros", scope: 100 },
  { rol: "Supervisor", desc: "Cierres de caja, descuentos y reembolsos", scope: 75 },
  { rol: "Cajero", desc: "Venta, cobro y consulta de productos", scope: 40 },
  { rol: "Almacén", desc: "Inventario, entradas y órdenes de compra", scope: 35 },
];

function UsuariosPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Usuarios"
        description="Equipo con acceso al sistema y sus permisos."
        actions={
          <Button className="gap-2 rounded-xl" onClick={() => toast.success("Invitación enviada")}>
            <UserPlus className="size-4" /> Invitar usuario
          </Button>
        }
      />

      <div className="panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Usuario</TableHead>
              <TableHead className="hidden sm:table-cell">Rol</TableHead>
              <TableHead className="hidden md:table-cell">Turno</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-surface text-xs font-semibold">
                        {u.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{u.nombre}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary" className="rounded-full font-normal">
                    {u.rol}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <Clock className="size-3.5" /> {u.turno}
                  </span>
                </TableCell>
                <TableCell>
                  <Switch defaultChecked={u.activo} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="size-8 rounded-lg">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {permisos.map((p) => (
          <div key={p.rol} className="panel p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <h3 className="font-medium">{p.rol}</h3>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-primary" style={{ width: `${p.scope}%` }} />
            </div>
            <p className="numeric mt-2 text-xs text-muted-foreground">
              {p.scope}% de módulos habilitados
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
