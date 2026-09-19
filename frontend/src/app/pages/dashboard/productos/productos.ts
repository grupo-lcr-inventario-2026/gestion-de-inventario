import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { EstadoProducto, Producto, calcularDisponibilidad } from '../../../core/models/producto.model';
import { Categoria } from '../../../core/models/categoria.model';
import { ProductoService } from '../../../core/producto.service';
import { CategoriaService } from '../../../core/categoria.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  imports: [ReactiveFormsModule, FormsModule, NgClass],
  selector: 'app-productos',
  styles: ``,
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];

  formularioProducto: FormGroup;
  nombreNuevaCategoria = '';

  esAdministrador = false;
  mostrarFormulario = false;

  // Se pone en true cuando no se pudo hablar con la API, para avisarle al usuario.
  errorConexion = false;

  productoEditando: Producto | null = null;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private cambios: ChangeDetectorRef,
  ) {
    this.formularioProducto = this.formBuilder.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      ubicacion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.esAdministrador = this.authService.rolActual() === 'admin';

    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.productoService.obtenerTodos().subscribe({
      next: productos => {
        this.productos = productos;
        this.errorConexion = false;
        // Avisa que hay datos nuevos para que la tabla se vuelva a dibujar.
        this.cambios.markForCheck();
      },
      error: () => this.avisarErrorConexion(),
    });
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerTodas().subscribe({
      next: categorias => {
        this.categorias = categorias;
        this.errorConexion = false;
        this.cambios.markForCheck();
      },
      error: () => this.avisarErrorConexion(),
    });
  }

  // Muestra el cartel de error cuando la API no responde.
  avisarErrorConexion(): void {
    this.errorConexion = true;
    this.cambios.markForCheck();
  }

  obtenerDisponibilidad(stock: number): string {
    return calcularDisponibilidad(stock);
  }

  claseDisponibilidad(stock: number): string {
    const disponibilidad = calcularDisponibilidad(stock);

    if (disponibilidad === 'Agotado') {
      return 'bg-danger';
    }
    if (disponibilidad === 'Stock bajo') {
      return 'bg-warning text-dark';
    }
    return 'bg-success';
  }

  obtenerEstado(estado: EstadoProducto): string {
    return estado === 'almacenado' ? 'Almacenado' : 'Pendiente';
  }

  guardarProducto(): void {
    if (this.formularioProducto.invalid) {
      this.formularioProducto.markAllAsTouched();
      return;
    }

    const { nombre, categoria, precio, stock, ubicacion } = this.formularioProducto.value;

    if (this.productoEditando) {
      const productoEditado = {
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        stock: stock,
        ubicacion: ubicacion,
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
        ubicacion: ubicacion,
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
      ubicacion: producto.ubicacion,
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
      ubicacion: '',
    });
  }

  agregarCategoria(): void {
    const nombre = this.nombreNuevaCategoria.trim();

    if (!nombre) {
      return;
    }

    this.categoriaService.agregar({ nombre }).subscribe(() => {
      this.nombreNuevaCategoria = '';
      this.cargarCategorias();
    });
  }

  eliminarCategoria(id: number): void {
    const confirmar = confirm('¿Está seguro de eliminar esta categoría?');

    if (!confirmar) {
      return;
    }

    this.categoriaService.eliminar(id).subscribe(() => {
      this.cargarCategorias();
    });
  }
}
