import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AlertaStock {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  estado: 'CRITICO' | 'BAJO';
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  styles: ``,
  templateUrl: './reportes.html',
 
})
export class Reportes implements OnInit {
  
  totalProductos: number = 48;
  totalUnidadesStock: number = 1250;
  totalAlertas: number = 4;
  movimientosMes: number = 182;

  alertas: AlertaStock[] = [
    { id: 1, codigo: 'PROD-002', nombre: 'Teclado Mecánico RGB', categoria: 'Periféricos', stockActual: 2, stockMinimo: 5, estado: 'CRITICO' },
    { id: 2, codigo: 'PROD-008', nombre: 'Monitor 24" Full HD', categoria: 'Monitores', stockActual: 4, stockMinimo: 10, estado: 'BAJO' },
    { id: 3, codigo: 'PROD-015', nombre: 'Mouse Inalámbrico', categoria: 'Periféricos', stockActual: 1, stockMinimo: 8, estado: 'CRITICO' },
    { id: 4, codigo: 'PROD-021', nombre: 'Placa de Video RTX 4060', categoria: 'Componentes', stockActual: 3, stockMinimo: 5, estado: 'BAJO' }
  ];

  ngOnInit(): void {
    // Aquí en el futuro se pueden suscribir a los servicios de Stock / Productos
  }
}