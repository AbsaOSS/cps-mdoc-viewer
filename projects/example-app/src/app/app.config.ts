import { ApplicationConfig } from '@angular/core';
import { provideCPSMDocViewer } from 'cps-mdoc-viewer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCPSMDocViewer({
      headerTitle: 'CPSM Documentation Viewer',
      pageTitle: 'CPSM Documentation Viewer',
      logo: 'assets/images/rocket.svg'
    })
  ]
};
