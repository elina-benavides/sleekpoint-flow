# Movimientos y cuadre de inventario

Conservar el diseño actual y ampliar únicamente Inventario con una experiencia completa para escritorio y móvil.

- Tres acciones: **Entrada**, **Salida** y **Conteo y cuadre**.
- Buscar por nombre o SKU, añadir varios productos, indicar cantidades y motivo, y revisar las existencias resultantes antes de confirmar.
- Conteos por categoría y, solo para ferreterías, por ubicación. Mostrar diferencias después de introducir el conteo físico; los productos sin contar no se ajustan.
- Historial con detalle, fecha, motivo y corrección mediante movimiento inverso, sin borrar registros.
- Existencias y alertas actualizadas durante la sesión; catálogo y terminal muestran esas mismas existencias sin cambiar su diseño.
- Formularios cómodos en móvil, tablas en escritorio y compatibilidad con el modo oscuro.

## Alcance
Esta entrega sigue siendo una experiencia de interfaz con datos de ejemplo: los movimientos duran durante la sesión y no hay usuarios autenticados. No incluye almacenamiento permanente, permisos reales ni cambios al proceso de cobro; la integración automática de ventas queda pendiente de conectar ese proceso.

## Detalles técnicos
Separar reglas de inventario, estado reactivo de sesión y formularios. Validar cantidades, impedir existencias negativas, confirmar cambios de forma atómica y probar entradas, salidas, conteos y reversos. Verificar los flujos en escritorio y móvil.