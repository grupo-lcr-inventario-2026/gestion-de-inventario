import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-quienes-somos',
  styles: ``,
  templateUrl: './quienes-somos.html',
  styleUrl: './quienes-somos.css'
  }
)

export class QuienesSomos {
  equipo = [
    { nombre: 'Facu', rol: 'Scaffold & Arquitectura Base', desc: 'Líder técnico y encargado de la integración del sistema.' },
    { nombre: 'Mati', rol: 'Capa de Datos & Autenticación', desc: 'Desarrollador Fullstack a cargo de servicios y modelos.' },
    { nombre: 'Caro', rol: 'Gestión de Productos', desc: 'Especialista Frontend encargada del ABM de inventario.' },
    { nombre: 'Julia', rol: 'Control de Stock & Landing', desc: 'Desarrolladora Frontend a cargo de movimientos de stock.' },
    { nombre: 'Diego', rol: 'Reportes, Institucional & Datos', desc: 'Encargado de análisis de datos y documentación del sistema.' }
  ];
}
