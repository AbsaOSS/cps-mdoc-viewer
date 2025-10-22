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
import { map, Observable } from 'rxjs';
import { Category } from '../../../models/categories.interface';
import { CategoriesDataService } from '../../../services/categories-data.service';
import { ListItem } from '../directive/active-link.directive';

const TABLE_CONTENTS_SUBHEADING = 'table-contents-subheading-';

@Injectable({
  providedIn: 'root'
})
export class TableContentsService {
  private categoriesDataService = inject(CategoriesDataService);

  getCategorizedTableContents(directory: string): Observable<ListItem[]> {
    return this.categoriesDataService
      .getCategories()
      .pipe(map((res: Category) => this.prepareListItems(res[directory])));
  }

  prepareListItems(json: Category): ListItem[] {
    const items: ListItem[] = [];

    for (const item of json.sortedOrder) {
      if (typeof item === 'string') {
        const subJson = json[item];
        if (subJson.sortedOrder) {
          items.push(...this.prepareListItems(subJson));
        }
      } else {
        const listItemClass =
          item.level > 1 ? `${TABLE_CONTENTS_SUBHEADING}${item.level - 1}` : '';
        items.push({ title: item.title, class: listItemClass, id: item.id });
      }
    }
    return items;
  }
}
