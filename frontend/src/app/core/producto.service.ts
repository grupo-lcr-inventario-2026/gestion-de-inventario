import { Injectable } from '@angular/core';
import { Producto } from './models/producto.model';

export const CATEGORIAS = ['Útiles', 'Escritura', 'Archivado', 'Accesorios'];

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private productos: Producto[] = [
    { id: 1, nombre: 'Cuaderno A4', categoria: 'Útiles', precio: 1500, stock: 45 },
    { id: 2, nombre: 'Lapicera Azul', categoria: 'Escritura', precio: 500, stock: 8 },
    { id: 3, nombre: 'Carpeta Plástica', categoria: 'Archivado', precio: 900, stock: 0 },
  ];

  obtenerTodos(): Producto[] {
    return this.productos;
  }

  obtenerPorId(id: number): Producto | undefined {
    return this.productos.find(p => p.id === id);
  }

  agregar(nombre: string, categoria: string, precio: number, stock: number): void {
    const nuevoProducto: Producto = {
      id: this.productos.length + 1,
      nombre: nombre,
      categoria: categoria,
      precio: precio,
      stock: stock,
    };
    this.productos.push(nuevoProducto);
  }

  editar(id: number, nombre: string, categoria: string, precio: number, stock: number): void {
    const producto = this.obtenerPorId(id);
    if (producto) {
      producto.nombre = nombre;
      producto.categoria = categoria;
      producto.precio = precio;
      producto.stock = stock;
    }
  }

  eliminar(id: number): void {
    this.productos = this.productos.filter(p => p.id !== id);
  }

  actualizarStock(id: number, nuevoStock: number): void {
    const producto = this.obtenerPorId(id);
    if (producto) {
      producto.stock = nuevoStock;
    }
  }
}
