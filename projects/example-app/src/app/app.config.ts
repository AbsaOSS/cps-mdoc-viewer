import { ApplicationConfig } from '@angular/core';
import { provideCPSMDocViewer } from 'cps-mdoc-viewer';

export const appConfig: ApplicationConfig = {
  providers: [provideCPSMDocViewer()]
};
