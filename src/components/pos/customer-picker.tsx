import { useMemo, useState } from "react";
import { Check, Search, UserPlus, UserRound, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { crearCliente, useClientes } from "@/lib/clientes-store";
import type { Cliente } from "@/lib/pos-data";
import { cn } from "@/lib/utils";

type Props = {
  cliente: Cliente | null;
  onChange: (cliente: Cliente | null) => void;
};

const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** Selector de cliente del ticket: elegir uno existente o registrar uno nuevo. */
export function CustomerPicker({ cliente, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 max-w-[11rem] gap-1.5 rounded-lg text-xs"
          >
            <UserRound className="size-3.5 shrink-0" />
            <span className="truncate">{cliente ? cliente.nombre : "Cliente"}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cliente del ticket</DialogTitle>
            <DialogDescription>
              Asocia una venta a un cliente existente o registra uno nuevo.
            </DialogDescription>
          </DialogHeader>
          <PickerTabs
            selectedId={cliente?.id ?? null}
            onSelect={(c) => {
              onChange(c);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {cliente && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Quitar cliente"
          className="size-8 rounded-lg text-muted-foreground"
          onClick={() => onChange(null)}
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}

function PickerTabs({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (cliente: Cliente) => void;
}) {
  return (
    <Tabs defaultValue="existente">
      <TabsList className="grid w-full grid-cols-2 rounded-xl">
        <TabsTrigger value="existente" className="rounded-lg text-xs">
          Cliente existente
        </TabsTrigger>
        <TabsTrigger value="nuevo" className="rounded-lg text-xs">
          Nuevo cliente
        </TabsTrigger>
      </TabsList>

      <TabsContent value="existente" className="mt-4">
        <ExistingList selectedId={selectedId} onSelect={onSelect} />
      </TabsContent>

      <TabsContent value="nuevo" className="mt-4">
        <NewCustomerForm onCreated={onSelect} />
      </TabsContent>
    </Tabs>
  );
}

function ExistingList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (cliente: Cliente) => void;
}) {
  const clientes = useClientes();
  const [q, setQ] = useState("");

  const lista = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return clientes;
    return clientes.filter((c) =>
      [c.nombre, c.email, c.telefono].join(" ").toLowerCase().includes(term),
    );
  }, [clientes, q]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, correo o teléfono"
          className="h-10 rounded-xl pl-9"
        />
      </div>

      <ScrollArea className="h-64 pr-2">
        {lista.length === 0 ? (
          <p className="grid h-56 place-items-center text-sm text-muted-foreground">
            Sin coincidencias
          </p>
        ) : (
          <div className="space-y-1.5">
            {lista.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border border-transparent bg-surface/60 p-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent",
                  selectedId === c.id && "border-primary/50 bg-accent",
                )}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card text-xs font-semibold">
                  {iniciales(c.nombre)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{c.nombre}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {c.email} · {c.telefono}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                  {c.nivel}
                </span>
                {selectedId === c.id && <Check className="size-4 shrink-0 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

type FormState = { nombre: string; email: string; telefono: string; rfc: string };

const initialForm: FormState = { nombre: "", email: "", telefono: "", rfc: "" };

function NewCustomerForm({ onCreated }: { onCreated: (cliente: Cliente) => void }) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nombre.trim().length < 3) {
      setError("Ingresa el nombre completo del cliente.");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("El correo electrónico no es válido.");
      return;
    }
    setError(null);
    const cliente = crearCliente(form);
    toast.success("Cliente registrado", { description: cliente.nombre });
    setForm(initialForm);
    onCreated(cliente);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="nombre"
          label="Nombre completo"
          value={form.nombre}
          onChange={set("nombre")}
          placeholder="Ana Torres"
          className="sm:col-span-2"
          required
        />
        <Field
          id="email"
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="ana@mail.com"
        />
        <Field
          id="telefono"
          label="Teléfono"
          value={form.telefono}
          onChange={set("telefono")}
          placeholder="+52 55 0000 0000"
        />
        <Field
          id="rfc"
          label="RFC (opcional)"
          value={form.rfc}
          onChange={set("rfc")}
          placeholder="XAXX010101000"
          className="sm:col-span-2"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <DialogFooter>
        <Button type="submit" className="w-full gap-2 rounded-xl sm:w-auto">
          <UserPlus className="size-4" /> Guardar y asignar
        </Button>
      </DialogFooter>
    </form>
  );
}

function Field({
  id,
  label,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { id: string; label: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Input id={id} className="h-10 rounded-xl" {...props} />
    </div>
  );
}
