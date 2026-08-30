import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-recuperar-password',
  styles: ``,
  templateUrl: './recuperar-password.html',
})
export class RecuperarPassword {
  formularioRecuperacion: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formularioRecuperacion = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  enviarEnlace(): void {
    if (this.formularioRecuperacion.invalid) {
      this.formularioRecuperacion.markAllAsTouched();
      return;
    }

    const email = this.formularioRecuperacion.value.email;

    alert(`Se enviará un enlace de recuperación a ${email}`);
  }
}
