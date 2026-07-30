export type Product = {
  id: string;
  nombre: string;
  sku: string;
  categoria: string;
  precio: number;
  costo: number;
  stock: number;
  stockMin: number;
  emoji: string;
};

export const categorias = [
  "Todos",
  "Café",
  "Panadería",
  "Bebidas",
  "Snacks",
  "Postres",
] as const;

export const productos: Product[] = [
  { id: "p1", nombre: "Espresso Doble", sku: "CAF-001", categoria: "Café", precio: 2.5, costo: 0.7, stock: 240, stockMin: 40, emoji: "☕" },
  { id: "p2", nombre: "Cappuccino", sku: "CAF-002", categoria: "Café", precio: 3.4, costo: 1.1, stock: 180, stockMin: 40, emoji: "🥛" },
  { id: "p3", nombre: "Latte Vainilla", sku: "CAF-003", categoria: "Café", precio: 3.9, costo: 1.3, stock: 26, stockMin: 40, emoji: "🍦" },
  { id: "p4", nombre: "Cold Brew", sku: "CAF-004", categoria: "Café", precio: 4.2, costo: 1.4, stock: 95, stockMin: 30, emoji: "🧊" },
  { id: "p5", nombre: "Croissant", sku: "PAN-001", categoria: "Panadería", precio: 2.8, costo: 0.9, stock: 48, stockMin: 20, emoji: "🥐" },
  { id: "p6", nombre: "Pan de Masa Madre", sku: "PAN-002", categoria: "Panadería", precio: 5.5, costo: 1.8, stock: 12, stockMin: 15, emoji: "🍞" },
  { id: "p7", nombre: "Bagel Integral", sku: "PAN-003", categoria: "Panadería", precio: 3.2, costo: 1.0, stock: 33, stockMin: 15, emoji: "🥯" },
  { id: "p8", nombre: "Jugo de Naranja", sku: "BEB-001", categoria: "Bebidas", precio: 3.6, costo: 1.2, stock: 64, stockMin: 25, emoji: "🍊" },
  { id: "p9", nombre: "Agua Mineral", sku: "BEB-002", categoria: "Bebidas", precio: 1.8, costo: 0.5, stock: 210, stockMin: 50, emoji: "💧" },
  { id: "p10", nombre: "Té Matcha", sku: "BEB-003", categoria: "Bebidas", precio: 4.0, costo: 1.5, stock: 41, stockMin: 20, emoji: "🍵" },
  { id: "p11", nombre: "Mix de Nueces", sku: "SNK-001", categoria: "Snacks", precio: 4.5, costo: 2.0, stock: 58, stockMin: 20, emoji: "🥜" },
  { id: "p12", nombre: "Chips Artesanales", sku: "SNK-002", categoria: "Snacks", precio: 2.9, costo: 1.1, stock: 8, stockMin: 20, emoji: "🥔" },
  { id: "p13", nombre: "Cheesecake", sku: "POS-001", categoria: "Postres", precio: 5.9, costo: 2.2, stock: 19, stockMin: 10, emoji: "🍰" },
  { id: "p14", nombre: "Brownie", sku: "POS-002", categoria: "Postres", precio: 3.5, costo: 1.2, stock: 27, stockMin: 10, emoji: "🍫" },
  { id: "p15", nombre: "Galleta Avena", sku: "POS-003", categoria: "Postres", precio: 2.2, costo: 0.6, stock: 72, stockMin: 20, emoji: "🍪" },
  { id: "p16", nombre: "Muffin Arándanos", sku: "PAN-004", categoria: "Panadería", precio: 3.1, costo: 1.0, stock: 36, stockMin: 15, emoji: "🧁" },
];

export type Venta = {
  id: string;
  fecha: string;
  cliente: string;
  items: number;
  metodo: "Efectivo" | "Tarjeta" | "Transferencia";
  estado: "Completada" | "Pendiente" | "Reembolsada";
  total: number;
};

export const ventas: Venta[] = [
  { id: "#TKT-10482", fecha: "30 jul, 12:41", cliente: "Mostrador", items: 3, metodo: "Tarjeta", estado: "Completada", total: 12.4 },
  { id: "#TKT-10481", fecha: "30 jul, 12:22", cliente: "Laura Méndez", items: 5, metodo: "Efectivo", estado: "Completada", total: 24.9 },
  { id: "#TKT-10480", fecha: "30 jul, 11:58", cliente: "Mostrador", items: 1, metodo: "Tarjeta", estado: "Reembolsada", total: 3.4 },
  { id: "#TKT-10479", fecha: "30 jul, 11:31", cliente: "Andrés Rivas", items: 8, metodo: "Transferencia", estado: "Completada", total: 41.2 },
  { id: "#TKT-10478", fecha: "30 jul, 10:57", cliente: "Mostrador", items: 2, metodo: "Efectivo", estado: "Pendiente", total: 7.1 },
  { id: "#TKT-10477", fecha: "30 jul, 10:12", cliente: "Cafetería Norte", items: 14, metodo: "Transferencia", estado: "Completada", total: 96.5 },
  { id: "#TKT-10476", fecha: "30 jul, 09:44", cliente: "Sofía Duarte", items: 2, metodo: "Tarjeta", estado: "Completada", total: 8.9 },
  { id: "#TKT-10475", fecha: "30 jul, 09:05", cliente: "Mostrador", items: 4, metodo: "Efectivo", estado: "Completada", total: 15.3 },
];

export type Cliente = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  compras: number;
  gastado: number;
  nivel: "Nuevo" | "Frecuente" | "VIP";
};

export const clientes: Cliente[] = [
  { id: "c1", nombre: "Laura Méndez", email: "laura.mendez@mail.com", telefono: "+52 55 1234 5678", compras: 42, gastado: 918.4, nivel: "VIP" },
  { id: "c2", nombre: "Andrés Rivas", email: "a.rivas@mail.com", telefono: "+52 55 8765 4321", compras: 18, gastado: 402.1, nivel: "Frecuente" },
  { id: "c3", nombre: "Cafetería Norte", email: "compras@cafnorte.com", telefono: "+52 81 2233 4455", compras: 63, gastado: 4210.0, nivel: "VIP" },
  { id: "c4", nombre: "Sofía Duarte", email: "sofia.d@mail.com", telefono: "+52 55 9988 7766", compras: 7, gastado: 88.2, nivel: "Frecuente" },
  { id: "c5", nombre: "Marco Peña", email: "marco.pena@mail.com", telefono: "+52 33 4455 6677", compras: 2, gastado: 19.6, nivel: "Nuevo" },
  { id: "c6", nombre: "Valeria Ortiz", email: "v.ortiz@mail.com", telefono: "+52 55 3322 1100", compras: 25, gastado: 611.75, nivel: "Frecuente" },
];

export type Usuario = {
  id: string;
  nombre: string;
  rol: "Administrador" | "Cajero" | "Supervisor" | "Almacén";
  email: string;
  turno: string;
  activo: boolean;
};

export const usuarios: Usuario[] = [
  { id: "u1", nombre: "Elena Vargas", rol: "Administrador", email: "elena@pos.com", turno: "Completo", activo: true },
  { id: "u2", nombre: "Diego Salas", rol: "Cajero", email: "diego@pos.com", turno: "Matutino", activo: true },
  { id: "u3", nombre: "Paula Cruz", rol: "Supervisor", email: "paula@pos.com", turno: "Vespertino", activo: true },
  { id: "u4", nombre: "Iván Torres", rol: "Almacén", email: "ivan@pos.com", turno: "Matutino", activo: false },
];

export const ventasPorHora = [
  { hora: "08", total: 120 },
  { hora: "09", total: 210 },
  { hora: "10", total: 340 },
  { hora: "11", total: 290 },
  { hora: "12", total: 480 },
  { hora: "13", total: 520 },
  { hora: "14", total: 380 },
  { hora: "15", total: 260 },
  { hora: "16", total: 310 },
  { hora: "17", total: 420 },
  { hora: "18", total: 360 },
];

export const ventasSemana = [
  { dia: "Lun", ventas: 1840, tickets: 96 },
  { dia: "Mar", ventas: 2110, tickets: 108 },
  { dia: "Mié", ventas: 1720, tickets: 88 },
  { dia: "Jue", ventas: 2480, tickets: 131 },
  { dia: "Vie", ventas: 3120, tickets: 164 },
  { dia: "Sáb", ventas: 3890, tickets: 201 },
  { dia: "Dom", ventas: 2260, tickets: 119 },
];

export const mixCategorias = [
  { name: "Café", value: 42 },
  { name: "Panadería", value: 24 },
  { name: "Bebidas", value: 16 },
  { name: "Postres", value: 11 },
  { name: "Snacks", value: 7 },
];

export const money = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export const movimientosCaja = [
  { id: "m1", hora: "08:00", tipo: "Apertura", concepto: "Fondo inicial de caja", monto: 200 },
  { id: "m2", hora: "10:24", tipo: "Ingreso", concepto: "Ventas en efectivo", monto: 318.5 },
  { id: "m3", hora: "11:40", tipo: "Egreso", concepto: "Compra de insumos", monto: -64.2 },
  { id: "m4", hora: "13:05", tipo: "Ingreso", concepto: "Ventas en efectivo", monto: 421.8 },
  { id: "m5", hora: "15:30", tipo: "Egreso", concepto: "Retiro parcial", monto: -300 },
];
