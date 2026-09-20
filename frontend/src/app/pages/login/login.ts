import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styles: ``,
  templateUrl: './login.html',
})
export class Login {
  form: FormGroup;
  error = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.password;

    this.authService.login(email, password).subscribe({
      next: exito => {
        if (exito) {
          this.error = false;

          // Cada rol arranca en su pantalla principal.
          if (this.authService.rolActual() === 'admin') {
            this.router.navigateByUrl('/dashboard/resumen');
          } else {
            this.router.navigateByUrl('/dashboard/panel');
          }
        } else {
          this.error = true;
        }
      },
      error: () => {
        this.error = true;
      },
    });
  }
}