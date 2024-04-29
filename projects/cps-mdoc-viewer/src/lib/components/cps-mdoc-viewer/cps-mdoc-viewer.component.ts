import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CpsDividerComponent } from 'cps-ui-kit';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'cps-mdoc-viewer',
  standalone: true,
  imports: [CpsDividerComponent, RouterOutlet, NavbarComponent],
  templateUrl: 'cps-mdoc-viewer.component.html',
  styles: ``
})
export class CpsMdocViewerComponent {
  scrollTop(): void {}
}
