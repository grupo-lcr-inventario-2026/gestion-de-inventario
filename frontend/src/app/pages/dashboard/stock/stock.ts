import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockService } from '../../../core/stock.service';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './stock.html',
})
export class Stock implements OnInit {
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);

  // Variable de productos requerida por stock.html
  productos: any[] = [];
  productoSeleccionado: any = null;

  stockForm: FormGroup = this.fb.group({
    productoId: ['', Validators.required],
    productoNombre: [{ value: '', disabled: true }],
    cantidad: ['', [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    if (this.stockService && (this.stockService as any).obtenerProductos) {
      this.productos = (this.stockService as any).obtenerProductos();
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

  actualizarStock(): void {
    if (this.stockForm.valid) {
      const { productoId, cantidad } = this.stockForm.getRawValue();
      
      if (this.stockService && (this.stockService as any).actualizarCantidad) {
        (this.stockService as any).actualizarCantidad(productoId, cantidad);
        this.cargarProductos();
      }

      this.stockForm.reset();
      this.productoSeleccionado = null;
    }
  }
}