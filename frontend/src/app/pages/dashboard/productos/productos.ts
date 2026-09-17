import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Producto, calcularDisponibilidad } from '../../../core/models/producto.model';
import { ProductoService } from '../../../core/producto.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-productos',
  styles: ``,
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  categorias: string[] = [];

  formularioProducto: FormGroup;

  esAdministrador = false;
  mostrarFormulario = false;

  productoEditando: Producto | null = null;

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.formularioProducto = this.formBuilder.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.cargarProductos();

    this.esAdministrador = this.authService.rolActual() === 'admin';
  }

  cargarProductos(): void {
    this.productoService.obtenerTodos().subscribe(productos => {
      this.productos = productos;
    });
  }

  obtenerEstado(stock: number): string {
    return calcularDisponibilidad(stock);
  }

  guardarProducto(): void {
    if (this.formularioProducto.invalid) {
      this.formularioProducto.markAllAsTouched();
      return;
    }

    const { nombre, categoria, precio, stock } = this.formularioProducto.value;

    if (this.productoEditando) {
      const productoEditado = {
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        stock: stock,
        ubicacion: this.productoEditando.ubicacion,
        estado: this.productoEditando.estado,
        cantidadPendiente: this.productoEditando.cantidadPendiente,
      };

      this.productoService.editar(this.productoEditando.id, productoEditado).subscribe(() => {
        this.cargarProductos();
      });
    } else {
      const productoNuevo = {
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        stock: stock,
        ubicacion: '',
        estado: 'almacenado' as const,
        cantidadPendiente: 0,
      };

      this.productoService.agregar(productoNuevo).subscribe(() => {
        this.cargarProductos();
      });
    }

    this.cancelarFormulario();
  }

  editarProducto(producto: Producto): void {
    this.productoEditando = producto;
    this.mostrarFormulario = true;

    this.formularioProducto.patchValue({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
    });
  }

  eliminarProducto(id: number): void {
    const confirmar = confirm('¿Está seguro de eliminar este producto?');

    if (!confirmar) {
      return;
    }

    this.productoService.eliminar(id).subscribe(() => {
      this.cargarProductos();
    });
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.productoEditando = null;
    this.formularioProducto.reset({
      nombre: '',
      categoria: '',
      precio: 0,
      stock: 0,
    });
  }
}
