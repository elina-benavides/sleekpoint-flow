import type { Product } from "./pos-data";

export type MovementKind = "Entrada" | "Salida" | "Conteo" | "Reverso";
export type InventoryLine = { productId: string; quantity: number };
export type StockChange = { productId: string; before: number; after: number; delta: number };
export type InventoryMovement = {
  id: string;
  date: string;
  kind: MovementKind;
  reason: string;
  reference: string;
  note: string;
  actor: string;
  changes: StockChange[];
  reverses?: string;
};

const round = (n: number) => Math.round(n * 1000) / 1000;

export function prepareMovement(products: Product[], kind: Exclude<MovementKind, "Reverso">, lines: InventoryLine[]): StockChange[] {
  if (!lines.length) throw new Error("Añade al menos un producto.");
  const seen = new Set<string>();
  return lines.map(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error("El producto ya no está disponible.");
    if (seen.has(productId)) throw new Error("Hay productos repetidos.");
    seen.add(productId);
    if (!Number.isFinite(quantity) || quantity < 0 || (kind !== "Conteo" && quantity === 0) || Math.abs(round(quantity) - quantity) > 0.000001) {
      throw new Error("Ingresa una cantidad válida, con hasta tres decimales.");
    }
    const after = round(kind === "Conteo" ? quantity : product.stock + (kind === "Salida" ? -quantity : quantity));
    if (after < 0) throw new Error(`${product.nombre}: solo hay ${product.stock} unidades disponibles.`);
    return { productId, before: product.stock, after, delta: round(after - product.stock) };
  });
}

export function prepareReversal(products: Product[], movement: InventoryMovement): StockChange[] {
  if (movement.kind === "Reverso") throw new Error("No se puede revertir una corrección.");
  return movement.changes.map((change) => {
    const product = products.find((p) => p.id === change.productId);
    if (!product) throw new Error("El producto ya no está disponible.");
    const after = round(product.stock - change.delta);
    if (after < 0) throw new Error(`${product.nombre}: no hay existencias suficientes para revertir este movimiento.`);
    return { productId: product.id, before: product.stock, after, delta: round(-change.delta) };
  });
}

export function applyChanges(products: Product[], changes: StockChange[]): Product[] {
  for (const change of changes) {
    const product = products.find((p) => p.id === change.productId);
    if (!product || product.stock !== change.before) throw new Error("Las existencias cambiaron. Vuelve a revisar el movimiento.");
    if (!Number.isFinite(change.after) || change.after < 0) throw new Error("El movimiento dejaría existencias negativas.");
  }
  return products.map((product) => {
    const change = changes.find((c) => c.productId === product.id);
    return change ? { ...product, stock: change.after } : product;
  });
}