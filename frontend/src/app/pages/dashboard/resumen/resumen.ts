import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenService, Resumen } from '../../../core/resumen.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.html'
})
export class ResumenComponent implements OnInit {
  totalPreparados: number = 0;
  totalPendientes: number = 0;
  totalEmpleadosActivos: number = 0;

  constructor(private resumenService: ResumenService) {}

  ngOnInit(): void {
    this.resumenService.obtener().subscribe((resumen : Resumen)=> {
      this.totalPreparados = resumen.productosPreparados;
      this.totalPendientes = resumen.productosPendientes;
      this.totalEmpleadosActivos = resumen.empleadosActivos;
    });
  }
}