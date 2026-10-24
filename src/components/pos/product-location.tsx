import { useState } from "react";
import { MapPin, Pencil, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { emptyLocation, formatLocation, type ProductLocation } from "@/lib/product-location";
import { setProductLocation } from "@/lib/business-ui-store";
import type { Product } from "@/lib/pos-data";

export function ProductLocationControl({ product, location }: { product: Product; location?: ProductLocation }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProductLocation>(emptyLocation);
  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value);
      if (value) { setDraft(location ?? emptyLocation()); setEditing(!location); }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" aria-label={`Ubicación de ${product.nombre}`} title={formatLocation(location)}
          className="h-auto min-h-9 w-full justify-start whitespace-normal rounded-none px-3 py-1.5 text-left text-[0.7rem] font-normal text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="min-w-0 break-words">{formatLocation(location, true)}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ubicación del producto</DialogTitle>
          <DialogDescription className="break-words">{product.nombre} · {product.sku}</DialogDescription>
        </DialogHeader>
        {editing ? (
          <form className="space-y-5" onSubmit={(event) => {
            event.preventDefault();
            const cleaned = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()])) as ProductLocation;
            setProductLocation(product.id, cleaned);
            setEditing(false);
          }}>
            <div className="grid grid-cols-2 gap-4">
              {([['pasillo', 'Pasillo'], ['estante', 'Estante'], ['nivel', 'Nivel'], ['gaveta', 'Gaveta / cajón']] as const).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`${product.id}-${key}`}>{label}</Label>
                  <Input id={`${product.id}-${key}`} value={draft[key]} maxLength={24}
                    onChange={(event) => setDraft((previous) => ({ ...previous, [key]: event.target.value }))} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit"><Save /> Guardar ubicación</Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start gap-3 border-y border-border py-5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="break-words text-sm font-medium leading-6">{formatLocation(location)}</p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => { setDraft(location ?? emptyLocation()); setEditing(true); }}><Pencil /> Editar ubicación</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}