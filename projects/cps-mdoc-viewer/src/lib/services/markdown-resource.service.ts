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

import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MarkdownFile, Category } from '../models/categories.interface';
import { CategoriesDataService } from './categories-data.service';

@Injectable({
  providedIn: 'root'
})
export class MarkdownResourceService {
  private categoriesDataService = inject(CategoriesDataService);


  getMarkdownFiles(directory: string): Observable<MarkdownFile[]> {
    return this.categoriesDataService
      .getCategories()
      .pipe(
        map((data: Category) => this.processMarkdownFiles(data, directory))
      );
  }

  private processMarkdownFiles(
    data: Category,
    directory: string
  ): MarkdownFile[] {
    const dir: Category = data[directory];
    if (!dir) {
      return [];
    }

    return dir.sortedOrder.reduce(
      (files: MarkdownFile[], item: string | MarkdownFile) => {
        if (typeof item === 'string') {
          return [...files, ...this.processMarkdownFiles(dir, item)];
        } else {
          return [...files, item];
        }
      },
      []
    );
  }
}
