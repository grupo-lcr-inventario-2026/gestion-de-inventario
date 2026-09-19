import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../core/producto.service';
import { MovimientoService } from '../../../core/movimiento.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-panel-trabajo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-trabajo.html'
})
export class PanelTrabajoComponent implements OnInit {
  pendientesAlmacenar: Producto[] = [];
  pendientesPreparar: Producto[] = [];

  // Alias para que coincida con lo que pusiste en tu HTML
  get productosAAlmacenar(): Producto[] {
    return this.pendientesAlmacenar;
  }

  get productosAPreparar(): Producto[] {
    return this.pendientesPreparar;
  }

  constructor(
    private productoService: ProductoService,
    private movimientoService: MovimientoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.productoService.obtenerTodos().subscribe((productos) => {
      this.pendientesAlmacenar = productos.filter(p => p.estado === 'pendiente_almacenar');
      this.pendientesPreparar = productos.filter(p => p.estado === 'pendiente_preparar');
    });
  }

  // Cuando presionas "Listo" / "Marcar almacenado"
  marcarAlmacenado(producto: Producto): void {
    const nuevoStock = producto.stock + producto.cantidadPendiente;

    const cambioProducto: Partial<Producto> = {
      stock: nuevoStock,
      estado: 'almacenado',
      cantidadPendiente: 0
    };

    // 1. Actualiza el producto en db.json
    this.productoService.actualizarParcial(producto.id, cambioProducto).subscribe(() => {
      
      // 2. RECIÉN AHORA registra el movimiento
      const nuevoMovimiento = {
        productoId: producto.id,
        tipo: 'ingreso' as const,
        cantidad: producto.cantidadPendiente,
        fecha: new Date().toISOString(),
        usuarioId: this.authService.usuario()?.id || 1
      };

      this.movimientoService.registrar(nuevoMovimiento).subscribe(() => {
        this.cargarTareas(); // Recarga las tablas
      });
    });
  }

  // Cuando presionas "Listo" / "Marcar preparado"
  marcarPreparado(producto: Producto): void {
    const nuevoStock = producto.stock - producto.cantidadPendiente;

    const cambioProducto: Partial<Producto> = {
      stock: nuevoStock,
      estado: 'almacenado',
      cantidadPendiente: 0
    };

    // 1. Actualiza el producto en db.json
    this.productoService.actualizarParcial(producto.id, cambioProducto).subscribe(() => {

      // 2. RECIÉN AHORA registra el movimiento
      const nuevoMovimiento = {
        productoId: producto.id,
        tipo: 'preparacion' as const,
        cantidad: producto.cantidadPendiente,
        fecha: new Date().toISOString(),
        usuarioId: this.authService.usuario()?.id || 1
      };

      this.movimientoService.registrar(nuevoMovimiento).subscribe(() => {
        this.cargarTareas(); // Recarga las tablas
      });
    });
  }
}