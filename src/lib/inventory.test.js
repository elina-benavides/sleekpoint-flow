import { describe, expect, test } from "bun:test";
import { prepareMovement, prepareReversal, applyChanges } from "./inventory";
import { recordMovement, reverseMovement, useInventory } from "./inventory-store";
import { productos } from "./pos-data";

const product = { ...productos[0], stock: 10 };
const lines = (quantity) => [{ productId: product.id, quantity }];
describe("inventory movements", () => {
  test("entry adds received quantity", () => {
    expect(prepareMovement([product], "Entrada", lines(5))[0].after).toBe(15);
  });
  test("exit subtracts quantity", () => {
    expect(prepareMovement([product], "Salida", lines(3))[0].after).toBe(7);
  });
  test("exit cannot make stock negative", () => {
    expect(() => prepareMovement([product], "Salida", lines(11))).toThrow();
  });
  test("physical count replaces stock and records the difference", () => {
    expect(prepareMovement([product], "Conteo", lines(7))[0]).toEqual({ productId: product.id, before: 10, after: 7, delta: -3 });
  });
  test("zero is a valid count", () => {
    expect(prepareMovement([product], "Conteo", lines(0))[0].after).toBe(0);
  });
  test("uncounted products are not adjusted", () => {
    const other = { ...productos[1], stock: 20 };
    expect(applyChanges([product, other], prepareMovement([product, other], "Conteo", lines(0)))[1].stock).toBe(20);
  });
  test("zero entries and exits are invalid", () => {
    for (const kind of ["Entrada", "Salida"]) expect(() => prepareMovement([product], kind, lines(0))).toThrow();
  });
  test("nonfinite, negative and overprecision quantities are invalid", () => {
    for (const n of [NaN, Infinity, -1, 1.0001]) expect(() => prepareMovement([product], "Conteo", lines(n))).toThrow();
  });
  test("fractional units up to three decimals are supported", () => {
    expect(prepareMovement([product], "Entrada", lines(0.125))[0].after).toBe(10.125);
  });
  test("repeated products are rejected", () => {
    expect(() => prepareMovement([product], "Entrada", [...lines(2), ...lines(3)])).toThrow();
  });
  test("review fails if stock changed before confirmation", () => {
    const changes = prepareMovement([product], "Entrada", lines(5));
    expect(() => applyChanges([{ ...product, stock: 9 }], changes)).toThrow();
  });
  test("reversal applies the inverse delta to current stock", () => {
    const movement = { kind: "Entrada", changes: prepareMovement([product], "Entrada", lines(5)) };
    expect(prepareReversal([{ ...product, stock: 12 }], movement)[0].after).toBe(7);
  });
  test("reversal cannot leave negative stock", () => {
    const movement = { kind: "Entrada", changes: prepareMovement([product], "Entrada", lines(5)) };
    expect(() => prepareReversal([{ ...product, stock: 2 }], movement)).toThrow();
  });
  test("reversal is a new record and cannot be repeated", () => {
    const movement = recordMovement({ kind: "Entrada", reason: "Recepción", reference: "", note: "", changes: prepareMovement(productos, "Entrada", [{ productId: product.id, quantity: 5 }]) });
    const correction = reverseMovement(movement.id, "Cantidad incorrecta");
    expect(correction.reverses).toBe(movement.id);
    expect(correction.changes[0].delta).toBe(-5);
    expect(() => reverseMovement(movement.id, "Otra corrección")).toThrow();
    expect(() => reverseMovement(correction.id, "Otra corrección")).toThrow();
  });
});