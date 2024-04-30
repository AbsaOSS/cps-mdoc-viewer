import {
  EnvironmentProviders,
  InjectionToken,
  SecurityContext,
  makeEnvironmentProviders
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { MarkdownFile } from './models/categories.interface';
import { inject } from '@angular/core';
import { firstDirectoryGuard } from './guards/first-directory.guard';
import { MarkdownViewerComponent } from './components/markdown-viewer/markdown-viewer.component';
import { MarkdownResourceService } from './services/markdown-resource.service';
import { MARKED_OPTIONS, MarkedOptions, provideMarkdown } from 'ngx-markdown';
import { HttpClient, provideHttpClient } from '@angular/common/http';

const markdownFilesResolver: ResolveFn<Observable<MarkdownFile[]>> = (
  route: ActivatedRouteSnapshot
) => {
  const markdownResourceService = inject(MarkdownResourceService);
  const selectedDirectory = route.paramMap.get('directory') ?? '';
  return markdownResourceService.getMarkdownFiles(selectedDirectory);
};

const routes: Routes = [':directory', '**'].map((path) => ({
  path,
  component: MarkdownViewerComponent,
  resolve: { markdownFiles: markdownFilesResolver },
  canActivate: [firstDirectoryGuard]
}));

function markedOptionsFactory(): MarkedOptions {
  return {
    hooks: {
      options: {},
      processAllTokens: (tokens) => tokens,
      preprocess: (markdown: string) => {
        // Remove metadata from markdown files
        const metadataPattern = /---[\s\S]*?---/;
        return markdown.replace(metadataPattern, '');
      },
      postprocess: (html: string) => html
    }
  };
}

export const CONFIG_INJECTION_TOKEN = new InjectionToken<CPSMDocViewerConfig>(
  'CPSMDocViewerConfig'
);

export interface CPSMDocViewerConfig {
  headerTitle: string;
  pageTitle: string;
  logo?: string;
}

export const provideCPSMDocViewer = (
  config: CPSMDocViewerConfig
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideRouter(routes),
    provideHttpClient(),
    provideMarkdown({
      loader: HttpClient,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory
      },
      sanitize: SecurityContext.NONE
    }),
    {
      provide: CONFIG_INJECTION_TOKEN,
      useValue: config
    }
  ]);
};
