import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarDashboard } from '../../shared/navbar-dashboard/navbar-dashboard';
import { Footer } from '../../shared/footer/footer';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, NavbarDashboard, Footer],
  selector: 'app-dashboard-layout',
  styles: ``,
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {}
