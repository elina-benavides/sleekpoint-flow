import { useSyncExternalStore } from "react";
import type { BusinessType, ProductLocation } from "./product-location";

// Presentation-only session state. No storage or backend persistence is implied.
type BusinessUI = {
  businessType: BusinessType;
  locations: Record<string, ProductLocation>;
};
const initial: BusinessUI = { businessType: "Panadería", locations: {} };
let state = initial;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
function publish(next: BusinessUI) {
  state = next;
  listeners.forEach((listener) => listener());
}
export function setBusinessType(businessType: BusinessType) {
  publish({ ...state, businessType });
}
export function setProductLocation(id: string, location: ProductLocation) {
  publish({ ...state, locations: { ...state.locations, [id]: location } });
}
export function useBusinessUI() {
  return useSyncExternalStore(subscribe, () => state, () => initial);
}