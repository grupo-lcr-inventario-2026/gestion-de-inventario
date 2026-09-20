import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProductoService } from '../../../core/producto.service';
import { MovimientoService } from '../../../core/movimiento.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.html'
})
export class ResumenComponent implements OnInit {
  totalPreparados: number = 0;
  totalPendientes: number = 0;
  totalEmpleadosActivos: number = 0;

  constructor(
    private productoService: ProductoService,
    private movimientoService: MovimientoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // 1. Cuenta los productos preparados
    this.movimientoService.obtenerTodos().subscribe((movs) => {
      this.totalPreparados = movs.filter(m => m.tipo === 'preparacion').length;
    });

    // 2. Cuenta las tareas pendientes
    this.productoService.obtenerTodos().subscribe((prods) => {
      this.totalPendientes = prods.filter(p => p.estado !== 'almacenado').length;
    });

    // 3. Cuenta empleados activos directamente desde la API
    this.http.get<Usuario[]>('http://localhost:3000/usuarios').subscribe((users) => {
      this.totalEmpleadosActivos = users.filter(u => u.rol === 'empleado' && u.activo).length;
    });
  }
}