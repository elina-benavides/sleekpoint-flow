import type { ReactNode } from "react";
import { Bell, Search, ChevronDown } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="text-muted-foreground" />
      <div className="relative hidden flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar productos, tickets o clientes…"
          className="h-9 max-w-sm border-transparent bg-surface pl-9 text-sm focus-visible:bg-card"
        />
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground">
          <Bell className="size-[1.05rem]" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
        </Button>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-2.5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary text-[0.7rem] font-semibold text-primary-foreground">
              EV
            </AvatarFallback>
          </Avatar>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-medium">Elena Vargas</p>
            <p className="text-[0.65rem] text-muted-foreground">Administrador</p>
          </div>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-[1.75rem]">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
