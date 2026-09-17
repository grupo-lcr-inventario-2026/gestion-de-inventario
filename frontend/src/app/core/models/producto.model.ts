// Estado de trabajo del producto dentro del deposito:
// - almacenado: no tiene tareas pendientes
// - pendiente_almacenar: llego mercaderia y el empleado tiene que guardarla
// - pendiente_preparar: hay que retirar unidades para entregar
export type EstadoProducto = 'almacenado' | 'pendiente_almacenar' | 'pendiente_preparar';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  ubicacion: string;
  estado: EstadoProducto;
  cantidadPendiente: number;
}

// Disponibilidad segun el stock actual (para mostrar en las tablas).
export function calcularDisponibilidad(stock: number): string {
  if (stock === 0) {
    return 'Agotado';
  }
  if (stock <= 10) {
    return 'Stock bajo';
  }
  return 'Disponible';
}
