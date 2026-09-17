import { Component, OnInit } from '@angular/core';

import { Producto } from '../../../core/models/producto.model';
import { ProductoService } from '../../../core/producto.service';

@Component({
  imports: [],
  selector: 'app-stock',
  styles: ``,
  templateUrl: './stock.html',
})
export class Stock implements OnInit {
  productos: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerTodos().subscribe(productos => {
      this.productos = productos;
    });
  }
}
