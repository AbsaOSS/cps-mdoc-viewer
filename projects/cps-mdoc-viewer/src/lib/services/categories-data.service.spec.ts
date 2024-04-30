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

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { CategoriesDataService } from './categories-data.service';
import { Category } from '../models/categories.interface';

describe('CategoriesDataService', () => {
  let service: CategoriesDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoriesDataService]
    });
    service = TestBed.inject(CategoriesDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch categories', (done) => {
    const mockCategories: Category = {
      sortedOrder: ['docs', 'features'],
      docs: {},
      features: {}
    };
    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
      done();
    });

    const req = httpMock.expectOne(service.pathToCategoriesJson);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should cache the result of getCategories', (done) => {
    const mockCategories: Category = {
      sortedOrder: ['docs', 'features'],
      docs: {},
      features: {}
    };

    service.getCategories().subscribe();
    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
      done();
    });

    const req = httpMock.expectOne(service.pathToCategoriesJson);
    req.flush(mockCategories);

    httpMock.expectNone(service.pathToCategoriesJson); // No second request, because the result is cached
  });

  it('should filter out future categories', (done) => {
    const mockCategories: Category = {
      sortedOrder: ['docs', 'features'],
      docs: {
        sortedOrder: [{ date: '2050-05-05' }, { date: '2050-05-05' }, 'doc2'],
        doc2: {
          date: '1990-05-05'
        }
      },
      features: {
        sortedOrder: [{}, 'feature1', 'feature2'],
        feature1: {
          sortedOrder: [{}]
        },
        feature2: {
          sortedOrder: [{ date: '2050-05-05' }]
        }
      }
    };

    const mockCategoriesWithoutFuture: Category = {
      sortedOrder: ['features'],
      features: {
        sortedOrder: [{}, 'feature1'],
        feature1: {
          sortedOrder: [{}]
        }
      }
    };

    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(mockCategoriesWithoutFuture);
      done();
    });

    const req = httpMock.expectOne(service.pathToCategoriesJson);
    req.flush(mockCategories);
  });
});
