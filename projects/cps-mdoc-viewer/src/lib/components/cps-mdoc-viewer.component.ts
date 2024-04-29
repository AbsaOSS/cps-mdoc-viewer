import { Component } from '@angular/core';
import { CpsDividerComponent } from 'cps-ui-kit';

@Component({
  selector: 'lib-cps-mdoc-viewer',
  standalone: true,
  imports: [CpsDividerComponent],
  template: ` <p>cps-mdoc-viewer works!</p><cps-divider />`,
  styles: ``
})
export class CpsMdocViewerComponent {}
