
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoService } from '../../../core/producto.service';
import { MovimientoService } from '../../../core/movimiento.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-panel-trabajo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-trabajo.html'
})
export class PanelTrabajoComponent implements OnInit {

  pendientesAlmacenar: Producto[] = [];
  pendientesPreparar: Producto[] = [];

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
    this.productoService.obtenerTodos().subscribe({
      next: (productos) => {
        this.pendientesAlmacenar = productos.filter(
          producto =>
            producto.estado === 'pendiente_almacenar' &&
            producto.cantidadPendiente > 0
        );

        this.pendientesPreparar = productos.filter(
          producto =>
            producto.estado === 'pendiente_preparar' &&
            producto.cantidadPendiente > 0
        );
      },
      error: (error) => {
        console.error('Error al cargar las tareas:', error);
        alert('No se pudieron cargar las tareas pendientes.');
      }
    });
  }

  marcarAlmacenado(producto: Producto): void {
    const usuarioId = this.authService.usuario()?.id;

    if (!usuarioId) {
      alert('No se pudo identificar al usuario que confirma la tarea.');
      return;
    }

    this.movimientoService.confirmar({
      productoId: producto.id,
      tipo: 'ingreso',
      usuarioId: usuarioId
    }).subscribe({
      next: () => {
        this.cargarTareas();
      },
      error: (error) => {
        console.error('Error al confirmar el ingreso:', error);

        alert(
          error.error?.detail ||
          'No se pudo confirmar el ingreso. Actualizá la lista e intentá nuevamente.'
        );

        this.cargarTareas();
      }
    });
  }

  marcarPreparado(producto: Producto): void {
    const usuarioId = this.authService.usuario()?.id;

    if (!usuarioId) {
      alert('No se pudo identificar al usuario que confirma la tarea.');
      return;
    }

    this.movimientoService.confirmar({
      productoId: producto.id,
      tipo: 'preparacion',
      usuarioId: usuarioId
    }).subscribe({
      next: () => {
        this.cargarTareas();
      },
      error: (error) => {
        console.error('Error al confirmar la preparación:', error);

        alert(
          error.error?.detail ||
          'No se pudo confirmar la preparación. Actualizá la lista e intentá nuevamente.'
        );

        this.cargarTareas();
      }
    });
  }
}
