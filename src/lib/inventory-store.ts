import { useSyncExternalStore } from "react";
import { productos } from "./pos-data";
import { applyChanges, prepareReversal, type InventoryMovement, type StockChange } from "./inventory";

// Frontend demonstration state; deliberately not persisted or attributed to a real user.
const initial = { products: productos, movements: [] as InventoryMovement[] };
let state = initial;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export function recordMovement(input: { kind: InventoryMovement["kind"]; reason: string; reference: string; note: string; changes: StockChange[]; reverses?: string }) {
  if (!input.reason.trim()) throw new Error("Selecciona un motivo.");
  if (!input.changes.length) throw new Error("Añade al menos un producto.");
  const products = applyChanges(state.products, input.changes);
  const movement: InventoryMovement = {
    ...input,
    id: `MOV-${String(state.movements.length + 1).padStart(4, "0")}`,
    date: new Date().toISOString(),
    actor: "Sesión de demostración",
  };
  state = { products, movements: [movement, ...state.movements] };
  listeners.forEach((listener) => listener());
  return movement;
}

export function reverseMovement(id: string, reason: string) {
  const movement = state.movements.find((m) => m.id === id);
  if (!movement) throw new Error("No se encontró el movimiento.");
  if (state.movements.some((m) => m.reverses === id)) throw new Error("Este movimiento ya fue revertido.");
  const changes = prepareReversal(state.products, movement);
  return recordMovement({ kind: "Reverso", reason, reference: id, note: "", changes, reverses: id });
}

export function useInventory() {
  return useSyncExternalStore(subscribe, () => state, () => initial);
}