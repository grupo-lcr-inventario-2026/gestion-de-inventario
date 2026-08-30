import { Injectable } from '@angular/core';
import { ProductoService } from './producto.service';

export interface MovimientoStock {
  id: number;
  productoId: number;
  tipo: string;
  cantidad: number;
  fecha: Date;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private movimientos: MovimientoStock[] = [];

  constructor(private productoService: ProductoService) {}

  obtenerMovimientos(): MovimientoStock[] {
    return this.movimientos;
  }

  registrarMovimiento(productoId: number, tipo: string, cantidad: number): void {
    const producto = this.productoService.obtenerPorId(productoId);
    if (!producto) {
      return;
    }

    let nuevoStock = producto.stock;
    if (tipo === 'entrada') {
      nuevoStock = producto.stock + cantidad;
    } else {
      nuevoStock = producto.stock - cantidad;
    }

    if (nuevoStock < 0) {
      nuevoStock = 0;
    }

    this.productoService.actualizarStock(productoId, nuevoStock);

    const nuevoMovimiento: MovimientoStock = {
      id: this.movimientos.length + 1,
      productoId: productoId,
      tipo: tipo,
      cantidad: cantidad,
      fecha: new Date(),
    };
    this.movimientos.push(nuevoMovimiento);
  }
}
