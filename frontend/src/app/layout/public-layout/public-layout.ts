import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarPublica } from '../../shared/navbar-publica/navbar-publica';
import { Footer } from '../../shared/footer/footer';

@Component({
  imports: [RouterOutlet, NavbarPublica, Footer],
  selector: 'app-public-layout',
  styles: ``,
  templateUrl: './public-layout.html',
})
export class PublicLayout {}
