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

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { Category } from '../models/categories.interface';
import { CONFIG_INJECTION_TOKEN, CPSMDocViewerConfig } from '../lib.provider';

@Injectable({
  providedIn: 'root'
})
export class CategoriesDataService {
  pathToCategoriesJson: string;
  private cache$: Observable<Category> | undefined;

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_INJECTION_TOKEN) config: CPSMDocViewerConfig
  ) {
    this.pathToCategoriesJson =
      (config.markdownFilesLocation.endsWith('/')
        ? config.markdownFilesLocation
        : config.markdownFilesLocation + '/') + 'categories.json';
  }

  getCategories(): Observable<Category> {
    if (!this.cache$) {
      this.cache$ = this.http.get<Category>(this.pathToCategoriesJson).pipe(
        map((data) => this.filterOutFutureCategories(data)),
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  filterOutFutureCategories(input: Category): Category {
    if (!input.sortedOrder) {
      return input;
    }

    const output: Category = { sortedOrder: [] };

    input.sortedOrder.forEach((item) => {
      if (typeof item === 'string') {
        const subCategory = input[item];
        if (
          subCategory?.sortedOrder &&
          subCategory.sortedOrder[0]?.date &&
          new Date(subCategory.sortedOrder[0].date) > new Date()
        ) {
          return;
        }
        output[item] = this.filterOutFutureCategories(subCategory);
        output.sortedOrder.push(item);
      } else {
        if (item.date && new Date(item.date) > new Date()) {
          return;
        }
        output.sortedOrder.push(item);
      }
    });

    return output;
  }
}
