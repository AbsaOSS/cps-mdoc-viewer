import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'cps-mdoc-viewer',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: 'cps-mdoc-viewer.component.html',
  styles: ``
})
export class CpsMdocViewerComponent {
  scrollTop(): void {}
}
