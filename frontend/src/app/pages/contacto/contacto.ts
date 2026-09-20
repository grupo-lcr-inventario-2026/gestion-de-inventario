import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ContactoService } from '../../core/contacto.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule],
  selector: 'app-contacto',
  styles: ``,
  templateUrl: './contacto.html',
})
export class Contacto {

  formulario: any;

  constructor(
    private fb: FormBuilder,
    private contactoService: ContactoService
  ) {
    this.formulario = this.fb.group({
      empresa: [''],
      nombre: [''],
      email: [''],
      mensaje: ['']
    });
  }

  enviar() {
    const datos = {
      ...this.formulario.value,
      fecha: new Date().toISOString()
    };

    this.contactoService.enviar(datos).subscribe({
      next: (respuesta) => {
        console.log('Contacto enviado:', respuesta);
        this.formulario.reset();
      },
      error: (error) => {
        console.error('Error al enviar contacto:', error);
      }
    });
  }

}