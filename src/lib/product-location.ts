export type BusinessType = "Tienda" | "Ferretería" | "Panadería";

export type ProductLocation = {
  pasillo: string;
  estante: string;
  nivel: string;
  gaveta: string;
};

export const supportsProductLocations = (businessType: BusinessType) =>
  businessType === "Ferretería";

export const emptyLocation = (): ProductLocation => ({
  pasillo: "", estante: "", nivel: "", gaveta: "",
});

export function formatLocation(location?: ProductLocation, compact = false) {
  if (!location) return "Sin ubicación";
  const fields = compact
    ? [["Pasillo", location.pasillo], ["Estante", location.estante], ["Nivel", location.nivel]]
    : [["Pasillo", location.pasillo], ["Estante", location.estante], ["Nivel", location.nivel], ["Gaveta", location.gaveta]];
  const parts = fields.filter(([, value]) => value.trim()).map(([label, value]) => `${label} ${value.trim()}`);
  if (compact && parts.length === 0 && location.gaveta.trim()) return `Gaveta ${location.gaveta.trim()}`;
  return parts.join(" · ") || "Sin ubicación";
}