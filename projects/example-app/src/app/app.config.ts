import { ApplicationConfig } from '@angular/core';
import { provideCPSMDocViewer } from 'cps-mdoc-viewer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCPSMDocViewer({
      headerTitle: 'CPS MDoc Viewer',
      pageTitle: 'CPS MDoc Viewer',
      logo: 'assets/images/rocket.svg'
    })
  ]
};
