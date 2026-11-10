import { useState } from "react";
import { ArrowRight, Check, ClipboardCheck, Minus, PackageMinus, PackagePlus, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory, recordMovement } from "@/lib/inventory-store";
import { prepareMovement, type StockChange } from "@/lib/inventory";
import { useBusinessUI } from "@/lib/business-ui-store";
import { formatLocation, supportsProductLocations } from "@/lib/product-location";
import { cn } from "@/lib/utils";

export type FormKind = "Entrada" | "Salida" | "Conteo";
const reasons = {
  Entrada: ["Compra / recepción", "Devolución de cliente", "Reposición", "Otro"],
  Salida: ["Daño / merma", "Pérdida", "Devolución a proveedor", "Uso interno", "Otro"],
  Conteo: ["Conteo periódico", "Verificación de existencias", "Inventario inicial", "Otro"],
};
const titles = { Entrada: "Registrar entrada", Salida: "Registrar salida", Conteo: "Conteo y cuadre" };
const icons = { Entrada: PackagePlus, Salida: PackageMinus, Conteo: ClipboardCheck };

export function MovementDialog({ kind, onClose }: { kind: FormKind; onClose: () => void }) {
  const { products } = useInventory();
  const { businessType, locations } = useBusinessUI();
  const showLocations = supportsProductLocations(businessType);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [location, setLocation] = useState("Todas");
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [reason, setReason] = useState(reasons[kind][0]);
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [review, setReview] = useState<StockChange[] | null>(null);
  const [error, setError] = useState("");
  const Icon = icons[kind];
  const categories = [...new Set(products.map((p) => p.categoria))];
  const locationOptions = [...new Set(products.map((p) => formatLocation(locations[p.id])))];
  const matches = products.filter((p) => (category === "Todos" || p.categoria === category) && (!showLocations || location === "Todas" || formatLocation(locations[p.id]) === location) && `${p.nombre} ${p.sku}`.toLowerCase().includes(query.toLowerCase()));
  const selected = products.filter((p) => Object.hasOwn(quantities, p.id));
  const counted = selected.filter((p) => quantities[p.id].trim() !== "");
  const setQuantity = (id: string, value: string) => { setQuantities((prev) => ({ ...prev, [id]: value })); setError(""); };
  const remove = (id: string) => setQuantities((prev) => { const next = { ...prev }; delete next[id]; return next; });
  const reviewMovement = () => {
    try {
      if (kind !== "Conteo" && selected.some((p) => quantities[p.id].trim() === "")) throw new Error("Completa la cantidad de cada producto.");
      if (reason === "Otro" && !note.trim()) throw new Error("Añade una nota con el motivo del movimiento.");
      const changes = prepareMovement(products, kind, counted.map((p) => ({ productId: p.id, quantity: Number(quantities[p.id]) })));
      setReview(changes); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo revisar el movimiento."); }
  };
  const confirm = () => {
    if (!review) return;
    try {
      const movement = recordMovement({ kind, reason, reference: reference.trim(), note: note.trim(), changes: review });
      toast.success(kind === "Conteo" ? "Conteo confirmado" : `${kind} registrada`, { description: `${movement.id} · ${review.length} productos` });
      onClose();
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudo confirmar."); setReview(null); }
  };

  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1rem)] max-w-3xl flex-col gap-0 overflow-hidden rounded-xl p-0">
      <DialogHeader className="shrink-0 border-b p-5 pr-12 text-left">
        <div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary"><Icon className="size-5" /></span><div><DialogTitle>{titles[kind]}</DialogTitle><DialogDescription className="mt-1">{review ? "Revisión final" : kind === "Conteo" ? "Conteo físico" : "Nuevo movimiento"} · Sesión de demostración</DialogDescription></div></div>
      </DialogHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        {review ? <div className="space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm"><p><span className="text-muted-foreground">Motivo: </span>{reason}</p>{reference && <p><span className="text-muted-foreground">Referencia: </span>{reference}</p>}</div>
          {note && <p className="break-words text-sm text-muted-foreground">{note}</p>}
          <div className="grid grid-cols-[minmax(0,1fr)_4rem_4rem_4rem] gap-2 border-b pb-2 text-right text-xs text-muted-foreground sm:grid-cols-[minmax(0,1fr)_5rem_5rem_5rem]"><span className="text-left">Producto</span><span>Actual</span><span>{kind === "Conteo" ? "Contado" : "Final"}</span><span>Diferencia</span></div>
          <div className="divide-y">{review.map((change) => <div key={change.productId} className="grid grid-cols-[minmax(0,1fr)_4rem_4rem_4rem] items-center gap-2 py-3 text-right text-sm sm:grid-cols-[minmax(0,1fr)_5rem_5rem_5rem]"><span className="min-w-0 break-words text-left font-medium">{products.find((p) => p.id === change.productId)?.nombre}</span><span className="numeric text-muted-foreground">{change.before}</span><span className="numeric font-semibold">{change.after}</span><span className={cn("numeric", change.delta < 0 ? "text-destructive" : change.delta > 0 ? "text-success" : "text-muted-foreground")}>{change.delta > 0 ? "+" : ""}{change.delta}</span></div>)}</div>
          {kind === "Conteo" && <p className="text-sm text-muted-foreground">{review.length} contados · {products.length - review.length} sin contar, sin cambios</p>}
        </div> : <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="movement-reason">Motivo</Label><Select value={reason} onValueChange={setReason}><SelectTrigger id="movement-reason" className="h-11 w-full"><SelectValue /></SelectTrigger><SelectContent>{reasons[kind].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label htmlFor="movement-reference">{kind === "Entrada" ? "Proveedor / referencia" : "Referencia"} <span className="font-normal text-muted-foreground">(opcional)</span></Label><Input id="movement-reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="" className="h-11" maxLength={150} /></div>
          </div>
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{kind === "Conteo" ? "Productos a contar" : "Productos"}</h3><span className="text-xs text-muted-foreground">{kind === "Conteo" ? `${counted.length} contados` : `${selected.length} añadidos`}</span></div>
            <div className="relative"><Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" /><Input aria-label="Buscar producto para movimiento" className="h-11 pl-9" placeholder="Buscar por nombre o SKU…" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && matches.length === 1) { const p = matches[0]; if (!Object.hasOwn(quantities, p.id)) setQuantity(p.id, ""); setQuery(""); } }} /></div>
            {kind === "Conteo" && <div className="flex flex-wrap gap-2"><Select value={category} onValueChange={setCategory}><SelectTrigger aria-label="Categoría del conteo" className="min-w-0 flex-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Todos">Todas las categorías</SelectItem>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>{showLocations && <Select value={location} onValueChange={setLocation}><SelectTrigger aria-label="Ubicación del conteo" className="min-w-0 flex-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Todas">Todas las ubicaciones</SelectItem>{locationOptions.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>}<Button variant="outline" disabled={!matches.length} onClick={() => setQuantities((prev) => ({ ...Object.fromEntries(matches.map((p) => [p.id, ""])), ...prev }))} className="gap-2"><Plus className="size-4" />Añadir grupo</Button></div>}
            <div className="max-h-40 overflow-y-auto rounded-lg border divide-y">{matches.filter((p) => !Object.hasOwn(quantities, p.id)).slice(0, query ? 16 : 4).map((p) => <Button key={p.id} variant="ghost" onClick={() => { setQuantity(p.id, ""); setQuery(""); }} className="h-auto min-h-12 w-full justify-between gap-3 whitespace-normal rounded-none px-3 py-2 text-left"><span className="flex min-w-0 items-center gap-2"><span className="text-xl">{p.emoji}</span><span className="min-w-0"><span className="block text-sm font-medium">{p.nombre}</span><span className="block text-xs font-normal text-muted-foreground">{p.sku}{showLocations ? ` · ${formatLocation(locations[p.id])}` : ""}</span></span></span><Plus className="size-4 shrink-0 text-primary" /></Button>)}{!matches.filter((p) => !Object.hasOwn(quantities, p.id)).length && <p className="p-3 text-sm text-muted-foreground">No hay más productos coincidentes.</p>}</div>
          </div>
          {selected.length > 0 ? <div className="divide-y border-y">{selected.map((p) => <div key={p.id} className="flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap"><div className="min-w-0 flex-1"><p className="text-sm font-medium">{p.nombre}</p><p className="text-xs text-muted-foreground">{kind !== "Conteo" && `${p.stock} u. disponibles · `}{p.sku}</p>{showLocations && <p className="text-xs text-muted-foreground">{formatLocation(locations[p.id])}</p>}</div><div className="flex shrink-0 items-center gap-1"><Button variant="ghost" size="icon" className="size-9" aria-label={`Reducir ${p.nombre}`} disabled={kind === "Conteo" || !quantities[p.id] || Number(quantities[p.id]) <= 1} onClick={() => setQuantity(p.id, String(Math.max(0, Number(quantities[p.id]) - 1)))}><Minus className="size-3.5" /></Button><div className="w-20"><Label htmlFor={`qty-${p.id}`} className="mb-1 block text-center text-[0.65rem] text-muted-foreground">{kind === "Conteo" ? "Contado" : "Cantidad"}</Label><Input id={`qty-${p.id}`} aria-label={`${kind === "Conteo" ? "Contado" : "Cantidad"} ${p.nombre}`} inputMode="decimal" type="number" min="0" step="0.001" className="numeric h-11 text-center" value={quantities[p.id]} placeholder="—" onChange={(e) => setQuantity(p.id, e.target.value)} /></div><Button variant="ghost" size="icon" className="size-9" aria-label={`Aumentar ${p.nombre}`} onClick={() => setQuantity(p.id, String(Number(quantities[p.id] || 0) + 1))}><Plus className="size-3.5" /></Button><Button variant="ghost" size="icon" className="size-9 text-muted-foreground" aria-label={`Quitar ${p.nombre}`} onClick={() => remove(p.id)}><Trash2 className="size-4" /></Button></div></div>)}</div> : <div className="py-3 text-center text-sm text-muted-foreground">Ningún producto añadido</div>}
          <div className="space-y-1.5"><Label htmlFor="movement-note">Nota {reason !== "Otro" && <span className="font-normal text-muted-foreground">(opcional)</span>}</Label><Textarea id="movement-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={2} /></div>
        </div>}
        {error && <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t bg-card p-4 sm:p-5"><Button variant="outline" className="h-11" onClick={() => review ? setReview(null) : onClose()}>{review ? "Volver" : "Cancelar"}</Button><Button className="h-11 gap-2" disabled={!review && !counted.length} onClick={review ? confirm : reviewMovement}>{review ? <Check className="size-4" /> : <ArrowRight className="size-4" />}{review ? kind === "Conteo" ? "Confirmar cuadre" : `Confirmar ${kind.toLowerCase()}` : "Revisar"}</Button></div>
    </DialogContent>
  </Dialog>;
}