import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'cps-mdoc-viewer',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: 'cps-mdoc-viewer.component.html',
  styles: `
    :host {
      .site-footer {
        background-color: var(--cps-color-calm);

        a {
          display: block;
          color: white;

          &:hover {
            text-decoration: none;
          }

          &:first-child {
            margin-bottom: 10px;
          }
        }

        .storyset-label {
          font-size: 12px;
        }
      }
    }
  `
})
export class CpsMdocViewerComponent {
  scrollTop(event: MouseEvent): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
