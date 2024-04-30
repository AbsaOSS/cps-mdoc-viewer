import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CpsMdocViewerComponent } from 'cps-mdoc-viewer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CpsMdocViewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
