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
  HttpRequest,
  HttpHandlerFn,
  HttpResponse,
  HttpEvent
} from '@angular/common/http';
import { of, take } from 'rxjs';
import { markdownCacheInterceptor } from './caching.interceptor';

describe('markdownCacheInterceptor', () => {
  it('should ignore requests not ending with .md', () => {
    let counter = 1;
    let firstResponse: HttpEvent<any> | undefined;
    let secondResponse: HttpEvent<any> | undefined;
    const sampleRequest = new HttpRequest(
      'GET',
      'http://localhost:4200/api/some-endpoint'
    );
    const sampleHandler: HttpHandlerFn = jest
      .fn()
      .mockImplementation(() =>
        of(new HttpResponse({ body: 'some api endpoint content ' + counter++ }))
      );

    markdownCacheInterceptor(sampleRequest, sampleHandler)
      .pipe(take(1))
      .subscribe((data) => (firstResponse = data));
    markdownCacheInterceptor(sampleRequest, sampleHandler)
      .pipe(take(1))
      .subscribe((data) => (secondResponse = data));
    expect(sampleHandler).toHaveBeenCalledTimes(2);
    expect(firstResponse).toEqual(
      new HttpResponse({ body: 'some api endpoint content 1' })
    );
    expect(secondResponse).toEqual(
      new HttpResponse({ body: 'some api endpoint content 2' })
    );
  });

  it('should ignore cache response of requests for .md files', () => {
    let counter = 1;
    let cachedResult: HttpEvent<any> | undefined;
    const sampleRequest = new HttpRequest(
      'GET',
      'http://localhost:4200/assets/categories/some-file.md'
    );
    const sampleHandler: HttpHandlerFn = jest
      .fn()
      .mockImplementation(() =>
        of(new HttpResponse({ body: 'some readme file content ' + counter++ }))
      );

    markdownCacheInterceptor(sampleRequest, sampleHandler)
      .pipe(take(1))
      .subscribe();
    markdownCacheInterceptor(sampleRequest, sampleHandler)
      .pipe(take(1))
      .subscribe((data) => (cachedResult = data));
    expect(sampleHandler).toHaveBeenCalledTimes(1);
    expect(cachedResult).toEqual(
      new HttpResponse({ body: 'some readme file content 1' })
    );
  });
});
