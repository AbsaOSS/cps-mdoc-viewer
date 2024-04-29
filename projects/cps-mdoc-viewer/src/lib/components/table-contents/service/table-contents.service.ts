import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from '../../../models/categories.interface';
import { CategoriesDataService } from '../../../services/categories-data.service';
import { ListItem } from '../directive/active-link.directive';

const TABLE_CONTENTS_SUBHEADING = 'table-contents-subheading-';

@Injectable({
  providedIn: 'root',
})
export class TableContentsService {
  constructor(private categoriesDataService: CategoriesDataService) {}

  getCategorizedTableContents(directory: string): Observable<ListItem[]> {
    return this.categoriesDataService.getCategories().pipe(map((res: Category) => this.prepareListItems(res[directory])));
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
        const listItemClass = item.level > 1 ? `${TABLE_CONTENTS_SUBHEADING}${item.level - 1}` : '';
        items.push({ title: item.title, class: listItemClass, id: item.id });
      }
    }
    return items;
  }
}
