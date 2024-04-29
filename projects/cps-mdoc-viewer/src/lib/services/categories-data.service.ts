import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { Category } from '../models/categories.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesDataService {
  pathToCategoriesJson = 'assets/categories/categories.json';
  private cache$: Observable<Category> | undefined;

  constructor(private http: HttpClient) {}

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
