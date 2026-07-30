import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanBarcode,
  Package,
  Boxes,
  Users,
  ReceiptText,
  Wallet,
  BarChart3,
  ShieldCheck,
  Settings,
  CircleDot,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const operacion = [
  { title: "Punto de venta", url: "/", icon: ScanBarcode },
  { title: "Panel", url: "/panel", icon: LayoutDashboard },
  { title: "Ventas", url: "/ventas", icon: ReceiptText },
  { title: "Caja", url: "/caja", icon: Wallet },
];

const catalogo = [
  { title: "Productos", url: "/productos", icon: Package },
  { title: "Inventario", url: "/inventario", icon: Boxes },
  { title: "Clientes", url: "/clientes", icon: Users },
];

const gestion = [
  { title: "Reportes", url: "/reportes", icon: BarChart3 },
  { title: "Usuarios", url: "/usuarios", icon: ShieldCheck },
  { title: "Configuración", url: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  const renderGroup = (label: string, items: typeof operacion) => (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/45">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                tooltip={item.title}
                className="h-10 rounded-lg text-sidebar-foreground/75 transition-colors data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              >
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="size-[1.05rem] shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <ScanBarcode className="size-[1.15rem]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-sidebar-accent-foreground">
                Aurea POS
              </p>
              <p className="truncate text-xs text-sidebar-foreground/50">Sucursal Centro</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-1">
        {renderGroup("Operación", operacion)}
        {renderGroup("Catálogo", catalogo)}
        {renderGroup("Gestión", gestion)}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent/50 px-3 py-2 text-xs text-sidebar-foreground/70">
          <CircleDot className="size-3.5 text-sidebar-primary" />
          {!collapsed && <span>Caja abierta · Turno AM</span>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
