import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-not-found',
  standalone: true,
  styles: ``,
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {}
