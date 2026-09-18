import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Producto } from '../../../core/models/producto.model';
import { ProductoService } from '../../../core/producto.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-stock',
  styles: ``,
  templateUrl: './stock.html',
})
export class Stock implements OnInit {
  productos: Producto[] = [];

  mensaje = '';
  error = '';

  ingresoForm;

  constructor(
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
  ) {
    this.ingresoForm = this.formBuilder.group({
      productoId: [0, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerTodos().subscribe(productos => {
      this.productos = productos;
    });
  }

  registrarIngreso(): void {
    this.mensaje = '';
    this.error = '';

    if (this.ingresoForm.invalid) {
      this.error = 'Completá el producto y una cantidad válida.';
      return;
    }

    const productoId = Number(this.ingresoForm.value.productoId);
    const cantidad = Number(this.ingresoForm.value.cantidad);

    const producto = this.productos.find(p => p.id === productoId);

    if (!producto) {
      this.error = 'No se encontró el producto seleccionado.';
      return;
    }

    if (producto.estado !== 'almacenado') {
      this.error = 'El producto ya tiene una tarea pendiente.';
      return;
    }

    this.productoService
      .actualizarParcial(producto.id, {
        estado: 'pendiente_almacenar',
        cantidadPendiente: cantidad,
      })
      .subscribe(() => {
        this.mensaje =
          'Ingreso registrado. El empleado debe almacenar la mercadería.';

        this.ingresoForm.reset({
          productoId: 0,
          cantidad: 1,
        });

        this.cargarProductos();
      });
  }
}
