import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Producto, calcularEstado } from '../../../core/models/producto.model';
import { ProductoService, CATEGORIAS } from '../../../core/producto.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-productos',
  styles: ``,
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  categorias = CATEGORIAS;

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
    this.productos = this.productoService.obtenerTodos();
  }

  obtenerEstado(stock: number): string {
    return calcularEstado(stock);
  }

  guardarProducto(): void {
    if (this.formularioProducto.invalid) {
      this.formularioProducto.markAllAsTouched();
      return;
    }

    const { nombre, categoria, precio, stock } = this.formularioProducto.value;

    if (this.productoEditando) {
      this.productoService.editar(
        this.productoEditando.id,
        nombre,
        categoria,
        precio,
        stock,
      );
    } else {
      this.productoService.agregar(
        nombre,
        categoria,
        precio,
        stock,
      );
    }

    this.cargarProductos();
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

    this.productoService.eliminar(id);
    this.cargarProductos();
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
