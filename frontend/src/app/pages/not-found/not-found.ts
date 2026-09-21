import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, RouterLink],
  selector: 'app-not-found',
  standalone: true,
  styles: ``,
  templateUrl: './not-found.html',
  
})
export class NotFound {}
