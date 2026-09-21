import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../core/usuario.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-recuperar-password',
  styles: ``,
  templateUrl: './recuperar-password.html',
})
export class RecuperarPassword {
  formularioRecuperacion: FormGroup;

  // Se usan para mostrar el cartel de exito o de error debajo del formulario.
  enviado = false;
  noExiste = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService
  ) {
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

    this.enviado = false;
    this.noExiste = false;

    this.usuarioService.buscarPorEmail(email).subscribe(usuarios => {
      if (usuarios.length > 0) {
        this.enviado = true;
      } else {
        this.noExiste = true;
      }
    });
  }
}
