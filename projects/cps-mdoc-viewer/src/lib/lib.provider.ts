/*
 * Copyright 2024 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  EnvironmentProviders,
  SecurityContext,
  makeEnvironmentProviders
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { MARKED_OPTIONS, MarkedOptions, provideMarkdown } from 'ngx-markdown';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { routes } from './config/routes';
import { CONFIG_INJECTION_TOKEN, CPSMDocViewerConfig } from './config/config';

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
