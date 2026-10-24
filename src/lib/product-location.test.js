import { describe, expect, test } from "bun:test";
import { emptyLocation, formatLocation, supportsProductLocations } from "./product-location";

describe("hardware-store locations", () => {
  test("locations are enabled for hardware stores", () => {
    expect(supportsProductLocations("Ferretería")).toBe(true);
  });
  test("retail stores do not show locations", () => {
    expect(supportsProductLocations("Tienda")).toBe(false);
  });
  test("bakeries do not show locations", () => {
    expect(supportsProductLocations("Panadería")).toBe(false);
  });
  test("missing locations are never invented", () => {
    expect(formatLocation()).toBe("Sin ubicación");
    expect(formatLocation(emptyLocation())).toBe("Sin ubicación");
  });
  test("compact location omits drawer but full detail retains it", () => {
    const location = { pasillo: "02", estante: "B", nivel: "3", gaveta: "08" };
    expect(formatLocation(location, true)).toBe("Pasillo 02 · Estante B · Nivel 3");
    expect(formatLocation(location)).toBe("Pasillo 02 · Estante B · Nivel 3 · Gaveta 08");
  });
});