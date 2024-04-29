import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MarkdownFile, Category } from '../models/categories.interface';
import { CategoriesDataService } from './categories-data.service';

@Injectable({
  providedIn: 'root',
})
export class MarkdownResourceService {
  constructor(private categoriesDataService: CategoriesDataService) {}

  getMarkdownFiles(directory: string): Observable<MarkdownFile[]> {
    return this.categoriesDataService.getCategories().pipe(map((data: Category) => this.processMarkdownFiles(data, directory)));
  }

  private processMarkdownFiles(data: Category, directory: string): MarkdownFile[] {
    const dir: Category = data[directory];
    if (!dir) {
      return [];
    }

    return dir.sortedOrder.reduce((files: MarkdownFile[], item: string | MarkdownFile) => {
      if (typeof item === 'string') {
        return [...files, ...this.processMarkdownFiles(dir, item)];
      } else {
        return [...files, item];
      }
    }, []);
  }
}
