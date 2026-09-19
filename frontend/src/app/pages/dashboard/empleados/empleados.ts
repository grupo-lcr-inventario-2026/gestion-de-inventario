import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Usuario } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/usuario.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-empleados',
  styles: ``,
  templateUrl: './empleados.html',
})
export class Empleados implements OnInit {
  usuarios: Usuario[] = [];

  mensaje = '';
  error = '';
  cargando = true;

  editandoId: number | null = null;
  mostrarFormulario = false;

  empleadoForm;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
  ) {
    this.empleadoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      activo: [true],
    });
  }

  ngOnInit(): void {
    console.log('EMPLEADOS: componente iniciado');
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    console.log('EMPLEADOS: solicitando usuarios');

    this.cargando = true;
    this.error = '';

    this.usuarioService.obtenerTodos().subscribe({
      next: usuarios => {
        console.log('EMPLEADOS: usuarios recibidos:', usuarios);

        this.usuarios = usuarios.filter(
          usuario => usuario.rol === 'empleado'
        );

        console.log(
          'EMPLEADOS: cantidad de empleados:',
          this.usuarios.length
        );

        this.cargando = false;
      },
      error: error => {
        console.error('EMPLEADOS: error:', error);

        this.cargando = false;
        this.error = 'No se pudieron cargar los empleados.';
      },
    });
  }

  nuevoEmpleado(): void {
    this.mensaje = '';
    this.error = '';
    this.editandoId = null;
    this.mostrarFormulario = true;

    this.empleadoForm.reset({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      activo: true,
    });
  }

  guardarEmpleado(): void {
    this.mensaje = '';
    this.error = '';

    if (this.empleadoForm.invalid) {
      this.empleadoForm.markAllAsTouched();
      this.error = 'Completá correctamente todos los campos.';
      return;
    }

    const datos = {
      nombre: this.empleadoForm.value.nombre ?? '',
      apellido: this.empleadoForm.value.apellido ?? '',
      email: this.empleadoForm.value.email ?? '',
      password: this.empleadoForm.value.password ?? '',
      rol: 'empleado' as const,
      activo: this.empleadoForm.value.activo ?? true,
    };

    if (this.editandoId === null) {
      this.usuarioService.agregar(datos).subscribe({
        next: () => {
          this.mensaje = 'Empleado dado de alta correctamente.';
          this.limpiarFormulario();
          this.cargarUsuarios();
        },
        error: () => {
          this.error = 'No se pudo dar de alta el empleado.';
        },
      });
    } else {
      this.usuarioService.editar(this.editandoId, datos).subscribe({
        next: () => {
          this.mensaje = 'Empleado actualizado correctamente.';
          this.limpiarFormulario();
          this.cargarUsuarios();
        },
        error: () => {
          this.error = 'No se pudo actualizar el empleado.';
        },
      });
    }
  }

  editarEmpleado(usuario: Usuario): void {
    this.mensaje = '';
    this.error = '';

    this.editandoId = usuario.id;
    this.mostrarFormulario = true;

    this.empleadoForm.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: usuario.password,
      activo: usuario.activo,
    });
  }

  cambiarEstado(usuario: Usuario): void {
    this.mensaje = '';
    this.error = '';

    const nuevoEstado = !usuario.activo;
    const accion = nuevoEstado ? 'dar de alta' : 'dar de baja';

    const confirmar = window.confirm(
      `¿Querés ${accion} a ${usuario.nombre} ${usuario.apellido}?`,
    );

    if (!confirmar) {
      return;
    }

    this.usuarioService.actualizarEstado(usuario.id, nuevoEstado).subscribe({
      next: () => {
        this.mensaje = nuevoEstado
          ? 'Empleado dado de alta correctamente.'
          : 'Empleado dado de baja correctamente.';

        this.cargarUsuarios();
      },
      error: () => {
        this.error = 'No se pudo modificar el estado del empleado.';
      },
    });
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.mostrarFormulario = false;

    this.empleadoForm.reset({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      activo: true,
    });
  }
}