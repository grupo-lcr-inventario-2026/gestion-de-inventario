import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar-dashboard',
  styles: ``,
  templateUrl: './navbar-dashboard.html',
})
export class NavbarDashboard {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  usuario() {
    return this.authService.usuario();
  }

  esAdmin(): boolean {
    return this.authService.rolActual() === 'admin';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
