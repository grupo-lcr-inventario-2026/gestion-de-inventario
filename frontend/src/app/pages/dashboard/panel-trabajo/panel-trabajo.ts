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
      
      this.pendientesAlmacenar = productos.filter(p => 
        p.estado === 'pendiente_almacenar' || 
        
        (p.cantidadPendiente > 0 && p.estado?.includes('almacenar'))
      );

     
      this.pendientesPreparar = productos.filter(p => 
        p.estado === 'pendiente_preparar' || 
        
        (p.cantidadPendiente > 0 && p.estado?.includes('preparar'))
      );
    });
  }

 
  marcarAlmacenado(producto: Producto): void {
    const cantidad = producto.cantidadPendiente || 0;
    const nuevoStock = producto.stock + cantidad;

    const cambioProducto: Partial<Producto> = {
      stock: nuevoStock,
      estado: 'almacenado',
      cantidadPendiente: 0
    };

    
    this.productoService.actualizarParcial(producto.id, cambioProducto).subscribe(() => {
      
      
      const nuevoMovimiento = {
        productoId: producto.id,
        tipo: 'ingreso' as const,
        cantidad: cantidad,
        fecha: new Date().toISOString(),
        usuarioId: this.authService.usuario()?.id || 1
      };

      this.movimientoService.registrar(nuevoMovimiento).subscribe(() => {
        this.cargarTareas(); 
      });
    });
  }

 
  marcarPreparado(producto: Producto): void {
    const cantidad = producto.cantidadPendiente || 0;
    const nuevoStock = producto.stock - cantidad;

    const cambioProducto: Partial<Producto> = {
      stock: nuevoStock,
      estado: 'almacenado',
      cantidadPendiente: 0
    };

    
    this.productoService.actualizarParcial(producto.id, cambioProducto).subscribe(() => {

     
      const nuevoMovimiento = {
        productoId: producto.id,
        tipo: 'preparacion' as const,
        cantidad: cantidad,
        fecha: new Date().toISOString(),
        usuarioId: this.authService.usuario()?.id || 1
      };

      this.movimientoService.registrar(nuevoMovimiento).subscribe(() => {
        this.cargarTareas(); 
      });
    });
  }
}