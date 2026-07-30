import { useSyncExternalStore } from "react";

import { clientes as seed, type Cliente } from "@/lib/pos-data";

/**
 * Store mínimo y sin dependencias para el directorio de clientes.
 * Se expone vía useSyncExternalStore para que cualquier vista pueda leerlo
 * sin acoplarse a un provider. Reemplazable por una API/Cloud sin tocar la UI.
 */
let state: Cliente[] = seed;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

export type NuevoClienteInput = {
  nombre: string;
  email?: string;
  telefono?: string;
  rfc?: string;
};

export function crearCliente(input: NuevoClienteInput): Cliente {
  const cliente: Cliente = {
    id: `c-${Date.now().toString(36)}`,
    nombre: input.nombre.trim(),
    email: input.email?.trim() || "—",
    telefono: input.telefono?.trim() || "—",
    compras: 0,
    gastado: 0,
    nivel: "Nuevo",
  };
  state = [cliente, ...state];
  emit();
  return cliente;
}

export function useClientes(): Cliente[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
