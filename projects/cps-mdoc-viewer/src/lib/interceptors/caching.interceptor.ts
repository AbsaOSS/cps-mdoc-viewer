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
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

const markdownFilesCache = new Map<string, HttpResponse<unknown>>();

export function markdownCacheInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  if (req.url.endsWith('.md')) {
    const cachedFile = markdownFilesCache.get(req.url);
    if (cachedFile) {
      return of(cachedFile);
    }
  }
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && req.url.endsWith('.md')) {
        markdownFilesCache.set(req.url, event);
      }
    })
  );
}
