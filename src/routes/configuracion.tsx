import { createFileRoute } from "@tanstack/react-router";
import { Store, Receipt, Printer, Percent, Save } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración — Aurea POS" },
      {
        name: "description",
        content: "Ajustes del negocio, impuestos, tickets, impresoras y métodos de pago.",
      },
      { property: "og:title", content: "Configuración — Aurea POS" },
      {
        property: "og:description",
        content: "Ajusta datos fiscales, impuestos, tickets e impresión.",
      },
    ],
  }),
  component: ConfiguracionPage,
});

function ConfiguracionPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Configuración"
        description="Preferencias del negocio y del terminal de venta."
        actions={
          <Button className="gap-2 rounded-xl" onClick={() => toast.success("Cambios guardados")}>
            <Save className="size-4" /> Guardar cambios
          </Button>
        }
      />

      <Tabs defaultValue="negocio" className="space-y-5">
        <TabsList className="rounded-xl">
          <TabsTrigger value="negocio" className="rounded-lg gap-1.5 text-xs sm:text-sm">
            <Store className="size-3.5" /> Negocio
          </TabsTrigger>
          <TabsTrigger value="impuestos" className="rounded-lg gap-1.5 text-xs sm:text-sm">
            <Percent className="size-3.5" /> Impuestos
          </TabsTrigger>
          <TabsTrigger value="ticket" className="rounded-lg gap-1.5 text-xs sm:text-sm">
            <Receipt className="size-3.5" /> Ticket
          </TabsTrigger>
          <TabsTrigger value="hardware" className="rounded-lg gap-1.5 text-xs sm:text-sm">
            <Printer className="size-3.5" /> Hardware
          </TabsTrigger>
        </TabsList>

        <TabsContent value="negocio">
          <div className="panel space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre comercial" value="Aurea Café & Panadería" />
              <Field label="RFC / Tax ID" value="AUR240715XY9" />
              <Field label="Teléfono" value="+52 55 4433 2211" />
              <Field label="Correo" value="hola@aureapos.com" />
            </div>
            <div className="space-y-2">
              <Label>Dirección fiscal</Label>
              <Textarea
                className="rounded-xl"
                defaultValue="Av. Reforma 210, Col. Centro, CDMX, 06000"
              />
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Moneda" value="USD" options={["USD", "MXN", "EUR", "COP"]} />
              <SelectField
                label="Zona horaria"
                value="GMT-6 Ciudad de México"
                options={["GMT-6 Ciudad de México", "GMT-5 Bogotá", "GMT+1 Madrid"]}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="impuestos">
          <div className="panel space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="IVA general (%)" value="16" />
              <Field label="Descuento máximo permitido (%)" value="20" />
            </div>
            <Separator />
            <Toggle label="Precios incluyen impuestos" desc="Muestra los precios finales en el catálogo" defaultOn />
            <Toggle label="Redondeo al cobrar en efectivo" desc="Redondea al múltiplo de 0.50 más cercano" />
            <Toggle label="Solicitar autorización para descuentos" desc="Requiere PIN de supervisor" defaultOn />
          </div>
        </TabsContent>

        <TabsContent value="ticket">
          <div className="panel space-y-5 p-6">
            <div className="space-y-2">
              <Label>Mensaje de pie de ticket</Label>
              <Textarea
                className="rounded-xl"
                defaultValue="¡Gracias por tu compra! Síguenos en @aureacafe"
              />
            </div>
            <Toggle label="Imprimir ticket automáticamente" desc="Al finalizar cada cobro" defaultOn />
            <Toggle label="Enviar ticket por correo" desc="Si el cliente tiene correo registrado" />
            <Toggle label="Mostrar código QR de factura" desc="Permite autofacturación del cliente" defaultOn />
          </div>
        </TabsContent>

        <TabsContent value="hardware">
          <div className="panel space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Impresora de tickets" value="Epson TM-T20III" options={["Epson TM-T20III", "Star TSP143", "Sin impresora"]} />
              <SelectField label="Cajón de dinero" value="Conectado a impresora" options={["Conectado a impresora", "USB directo", "Ninguno"]} />
              <SelectField label="Lector de código" value="Honeywell Voyager" options={["Honeywell Voyager", "Zebra DS2208", "Cámara del dispositivo"]} />
              <SelectField label="Terminal bancaria" value="Integrada" options={["Integrada", "Externa", "Ninguna"]} />
            </div>
            <Separator />
            <Toggle label="Abrir cajón en ventas en efectivo" defaultOn />
            <Toggle label="Modo offline con sincronización" desc="Guarda ventas localmente si se pierde conexión" defaultOn />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input defaultValue={value} className="rounded-xl" />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
}: {
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select defaultValue={value}>
        <SelectTrigger className="rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Toggle({
  label,
  desc,
  defaultOn,
}: {
  label: string;
  desc?: string;
  defaultOn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/50 p-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      <Switch defaultChecked={defaultOn} />
    </div>
  );
}
