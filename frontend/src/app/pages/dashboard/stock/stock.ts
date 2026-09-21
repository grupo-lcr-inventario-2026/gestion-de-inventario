import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Producto } from '../../../core/models/producto.model';
import { ProductoService } from '../../../core/producto.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule],
  selector: 'app-stock',
  styles: ``,
  templateUrl: './stock.html',
})
export class Stock implements OnInit {
  productos: Producto[] = [];

  ingresoForm;
  preparacionForm;

  mostrarIngreso = false;
  mostrarPreparacion = false;

  mensaje = '';
  error = '';
  errorConexion = false;

  constructor(
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    private cambios: ChangeDetectorRef,
  ) {
    this.ingresoForm = this.formBuilder.group({
      productoId: [0, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });

    this.preparacionForm = this.formBuilder.group({
      productoId: [0, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerTodos().subscribe({
      next: productos => {
        this.productos = productos;
        this.errorConexion = false;

        this.cambios.markForCheck();
      },

      error: () => {
        this.errorConexion = true;

        this.cambios.markForCheck();
      },
    });
  }

  claseEstado(estado: string): string {
    if (estado === 'pendiente_almacenar') {
      return 'bg-warning text-dark';
    }

    if (estado === 'pendiente_preparar') {
      return 'bg-primary';
    }

    return 'bg-success';
  }

  obtenerEstado(estado: string): string {
    if (estado === 'pendiente_almacenar') {
      return 'Pendiente de almacenar';
    }

    if (estado === 'pendiente_preparar') {
      return 'Pendiente de preparar';
    }

    return 'Almacenado';
  }

  registrarIngreso(): void {
    this.mensaje = '';
    this.error = '';

    if (this.ingresoForm.invalid) {
      this.ingresoForm.markAllAsTouched();
      this.error = 'Completá el producto y una cantidad válida.';
      return;
    }

    const productoId = Number(this.ingresoForm.value.productoId);
    const cantidad = Number(this.ingresoForm.value.cantidad);

    const producto = this.productos.find(
      producto => producto.id === productoId
    );

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
      .subscribe({
        next: () => {
          this.mensaje =
            'Ingreso registrado. El empleado debe almacenar la mercadería.';

          this.ingresoForm.reset({
            productoId: 0,
            cantidad: 1,
          });

          this.mostrarIngreso = false;

          this.cargarProductos();
        },

        error: () => {
          this.errorConexion = true;
          this.cambios.markForCheck();
        },
      });
  }

  solicitarPreparacion(): void {
    this.mensaje = '';
    this.error = '';

    if (this.preparacionForm.invalid) {
      this.preparacionForm.markAllAsTouched();
      this.error = 'Completá el producto y una cantidad válida.';
      return;
    }

    const productoId = Number(this.preparacionForm.value.productoId);
    const cantidad = Number(this.preparacionForm.value.cantidad);

    const producto = this.productos.find(
      producto => producto.id === productoId
    );

    if (!producto) {
      this.error = 'No se encontró el producto seleccionado.';
      return;
    }

    if (producto.estado !== 'almacenado') {
      this.error = 'El producto ya tiene una tarea pendiente.';
      return;
    }

    if (cantidad > producto.stock) {
      this.error = `No hay suficiente stock. Disponible: ${producto.stock}.`;
      return;
    }

    this.productoService
      .actualizarParcial(producto.id, {
        estado: 'pendiente_preparar',
        cantidadPendiente: cantidad,
      })
      .subscribe({
        next: () => {
          this.mensaje =
            'Preparación solicitada. El empleado debe preparar la mercadería.';

          this.preparacionForm.reset({
            productoId: 0,
            cantidad: 1,
          });

          this.mostrarPreparacion = false;

          this.cargarProductos();
        },

        error: () => {
          this.errorConexion = true;
          this.cambios.markForCheck();
        },
      });
  }

  cancelarIngreso(): void {
    this.mostrarIngreso = false;

    this.ingresoForm.reset({
      productoId: 0,
      cantidad: 1,
    });
  }

  cancelarPreparacion(): void {
    this.mostrarPreparacion = false;

    this.preparacionForm.reset({
      productoId: 0,
      cantidad: 1,
    });
  }

  cambiarFormulario(formulario: 'ingreso' | 'preparacion'): void {
    this.mensaje = '';
    this.error = '';

    if (formulario === 'ingreso') {
      this.mostrarIngreso = !this.mostrarIngreso;
      this.mostrarPreparacion = false;
      return;
    }

    this.mostrarPreparacion = !this.mostrarPreparacion;
    this.mostrarIngreso = false;
  }
}
