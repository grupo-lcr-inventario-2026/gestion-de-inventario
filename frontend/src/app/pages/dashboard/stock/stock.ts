import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockService } from '../../../core/stock.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stock.html',
})
export class Stock implements OnInit {
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);

  productos: any[] = [];
  productoSeleccionado: any = null;

  // Sumamos el campo 'nombre' como editable para los productos nuevos
  stockForm: FormGroup = this.fb.group({
    productoId: [''],
    productoNombre: ['', Validators.required],
    cantidad: ['', [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    const servicio = this.stockService as any;

    if (servicio.obtenerProductos) {
      this.productos = servicio.obtenerProductos();
    } else if (servicio.getProductos) {
      this.productos = servicio.getProductos();
    } else if (servicio.productos) {
      this.productos = servicio.productos;
    }
  }

  seleccionarProducto(producto: any): void {
    this.productoSeleccionado = producto;
    this.stockForm.patchValue({
      productoId: producto.id,
      productoNombre: producto.nombre,
      cantidad: producto.cantidad,
    });
  }

  // Cancela la selección para poder ingresar un producto nuevo
  limpiarSeleccion(): void {
    this.productoSeleccionado = null;
    this.stockForm.reset();
  }

  actualizarStock(): void {
    if (this.stockForm.valid) {
      const { productoId, productoNombre, cantidad } = this.stockForm.getRawValue();
      const servicio = this.stockService as any;

      if (this.productoSeleccionado) {
        // CASO A: Actualizar producto existente
        if (servicio.actualizarCantidad) {
          servicio.actualizarCantidad(productoId, cantidad);
        }

        const prod = this.productos.find(p => p.id === productoId);
        if (prod) {
          prod.cantidad = cantidad;
        }
      } else {
        // CASO B: Ingresar producto NUEVO al stock
        const nuevoProducto = {
          id: Date.now(),
          nombre: productoNombre,
          cantidad: cantidad
        };

        if (servicio.agregarProducto) {
          servicio.agregarProducto(nuevoProducto);
        } else {
          this.productos.push(nuevoProducto);
        }
      }

      this.limpiarSeleccion();
    }
  }
}