import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Category } from '../models/categories.interface';
import { CategoriesDataService } from './categories-data.service';
import { DirectoryToolbarInfo } from '../models/directory-toolbar-info.interface';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  constructor(private categoriesDataService: CategoriesDataService) {}

  getTopLevelDirectories(): Observable<DirectoryToolbarInfo[]> {
    return this.categoriesDataService.getCategories().pipe(
      map((data: Category) => {
        return data.sortedOrder.map((item) => {
          let toolbar_title: string;
          let directory: string;

          if (typeof item === 'string') {
            directory = item;
            toolbar_title = data[item].sortedOrder[0].toolbar_title ?? item;
          } else {
            directory = '';
            toolbar_title = item.toolbar_title ?? 'Error: No title found';
          }

          return { toolbar_title, directory };
        });
      }),
      catchError((error) => {
        console.error(
          'Error occurred while fetching top level directories:',
          error
        );
        return throwError(() => error);
      })
    );
  }

  getFirstDirectory(): Observable<DirectoryToolbarInfo> {
    return this.getTopLevelDirectories().pipe(
      map((directories: DirectoryToolbarInfo[]) => directories[0]),
      catchError((error) => {
        console.error(
          'Error occurred while fetching first directories:',
          error
        );
        return throwError(() => error);
      })
    );
  }
}
