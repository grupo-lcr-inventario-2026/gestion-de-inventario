export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

export function calcularEstado(stock: number): string {
  if (stock === 0) {
    return 'Agotado';
  }
  if (stock <= 10) {
    return 'Stock bajo';
  }
  return 'Disponible';
}
