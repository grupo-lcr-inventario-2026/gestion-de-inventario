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
    this.productoService.obtenerTodos().subscribe((productos) => {
      this.pendientesAlmacenar = productos.filter(p => p.estado === 'pendiente_almacenar');
      this.pendientesPreparar = productos.filter(p => p.estado === 'pendiente_preparar');
    });
  }

  
  marcarAlmacenado(producto: Producto): void {
    const nuevoStock = producto.stock + producto.cantidadPendiente;

    const cambioProducto: Partial<Producto> = {
      stock: nuevoStock,
      estado: 'almacenado',
      cantidadPendiente: 0
    };

    
    this.productoService.actualizarParcial(producto.id, cambioProducto).subscribe(() => {
      
    
      const nuevoMovimiento = {
        productoId: producto.id,
        tipo: 'ingreso' as const,
        cantidad: producto.cantidadPendiente,
        fecha: new Date().toISOString(),
        usuarioId: this.authService.usuario()?.id || 1
      };

      this.movimientoService.registrar(nuevoMovimiento).subscribe(() => {
        this.cargarTareas(); 
      });
    });
  }

  
  marcarPreparado(producto: Producto): void {
    const nuevoStock = producto.stock - producto.cantidadPendiente;

    const cambioProducto: Partial<Producto> = {
      stock: nuevoStock,
      estado: 'almacenado',
      cantidadPendiente: 0
    };

    
    this.productoService.actualizarParcial(producto.id, cambioProducto).subscribe(() => {

      
      const nuevoMovimiento = {
        productoId: producto.id,
        tipo: 'preparacion' as const,
        cantidad: producto.cantidadPendiente,
        fecha: new Date().toISOString(),
        usuarioId: this.authService.usuario()?.id || 1
      };

      this.movimientoService.registrar(nuevoMovimiento).subscribe(() => {
        this.cargarTareas(); 
      });
    });
  }
}