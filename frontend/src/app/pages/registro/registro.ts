import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

function passwordsIguales(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmar = form.get('confirmarPassword')?.value;

  if (password === confirmar) {
    return null;
  }
  return { passwordsDistintas: true };
}

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-registro',
  styles: ``,
  templateUrl: './registro.html',
})
export class Registro {
  form: FormGroup;
  emailDuplicado = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmarPassword: ['', Validators.required],
      },
      { validators: passwordsIguales }
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const nombre = this.form.value.nombre;
    const apellido = this.form.value.apellido;
    const email = this.form.value.email;
    const password = this.form.value.password;

    const exito = this.authService.registrar(nombre, apellido, email, password);

    if (exito) {
      this.emailDuplicado = false;
      this.router.navigateByUrl('/login');
    } else {
      this.emailDuplicado = true;
    }
  }
}
