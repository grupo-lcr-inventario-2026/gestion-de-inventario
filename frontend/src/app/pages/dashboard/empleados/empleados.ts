import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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

  formularioEmpleado: FormGroup;

  mostrarFormulario = false;
  empleadoEditando: Usuario | null = null;

  errorConexion = false;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private cambios: ChangeDetectorRef,
  ) {
    this.formularioEmpleado = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.usuarioService.obtenerTodos().subscribe({
      next: usuarios => {
        this.usuarios = usuarios.filter(
          usuario => usuario.rol === 'empleado'
        );

        this.errorConexion = false;

        this.cambios.markForCheck();
      },

      error: () => {
        this.errorConexion = true;

        this.cambios.markForCheck();
      },
    });
  }

  guardarEmpleado(): void {
    if (this.formularioEmpleado.invalid) {
      this.formularioEmpleado.markAllAsTouched();
      return;
    }

    const {
      nombre,
      apellido,
      email,
      password,
    } = this.formularioEmpleado.value;

    if (this.empleadoEditando) {
      const empleadoEditado = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
        rol: 'empleado' as const,
        activo: this.empleadoEditando.activo,
      };

      this.usuarioService
        .editar(this.empleadoEditando.id, empleadoEditado)
        .subscribe({
          next: () => {
            this.cargarEmpleados();
            this.cancelarFormulario();
          },
          error: () => {
            this.errorConexion = true;
            this.cambios.markForCheck();
          },
        });
    } else {
      const empleadoNuevo = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
        rol: 'empleado' as const,
        activo: true,
      };

      this.usuarioService.agregar(empleadoNuevo).subscribe({
        next: () => {
          this.cargarEmpleados();
          this.cancelarFormulario();
        },
        error: () => {
          this.errorConexion = true;
          this.cambios.markForCheck();
        },
      });
    }
  }

  editarEmpleado(usuario: Usuario): void {
    this.empleadoEditando = usuario;
    this.mostrarFormulario = true;

    this.formularioEmpleado.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: usuario.password,
    });
  }

  cambiarEstado(usuario: Usuario): void {
    const nuevoEstado = !usuario.activo;

    const accion = nuevoEstado
      ? 'dar de alta'
      : 'dar de baja';

    const confirmar = confirm(
      `¿Está seguro de ${accion} a ${usuario.nombre} ${usuario.apellido}?`
    );

    if (!confirmar) {
      return;
    }

    this.usuarioService
      .actualizarEstado(usuario.id, nuevoEstado)
      .subscribe({
        next: () => {
          this.cargarEmpleados();
        },
        error: () => {
          this.errorConexion = true;
          this.cambios.markForCheck();
        },
      });
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.empleadoEditando = null;

    this.formularioEmpleado.reset({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
    });
  }
}