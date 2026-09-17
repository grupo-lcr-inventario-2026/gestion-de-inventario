// Cada vez que un empleado confirma una tarea queda registrado un movimiento.
// - ingreso: se guardo mercaderia (el stock sube)
// - preparacion: se retiraron unidades (el stock baja)
export type TipoMovimiento = 'ingreso' | 'preparacion';

export interface Movimiento {
  id: number;
  productoId: number;
  tipo: TipoMovimiento;
  cantidad: number;
  fecha: string;
  usuarioId: number;
}
