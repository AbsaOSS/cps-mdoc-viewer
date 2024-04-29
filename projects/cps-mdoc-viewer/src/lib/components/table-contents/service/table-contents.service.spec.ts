import { TestBed } from '@angular/core/testing';

import { TableContentsService } from './table-contents.service';
import { MockProvider } from 'ng-mocks';
import { CategoriesDataService } from '../../../services/categories-data.service';
import { of } from 'rxjs';
import { Category } from '../../../models/categories.interface';

describe('TableContentsService', () => {
  let service: TableContentsService;
  const mackCategories: Category = {
    sortedOrder: ['docs', 'features'],
    docs: {},
    features: {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(CategoriesDataService, { getCategories: () => of(mackCategories) })],
    });
    service = TestBed.inject(TableContentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should prepare list items correctly with nested categories', () => {
    const category = {
      sortedOrder: [{ title: 'test', id: 'test', file: '_index.md', filePath: '', weight: 0, content: '', date: new Date(), level: 0 }, 'nestedCategory'],
      nestedCategory: {
        sortedOrder: [
          { title: 'nestedTest', id: 'nestedTest', file: '_index.md', filePath: '', weight: 0, content: '', level: 1, date: new Date() },
          'deepNestedCategory',
        ],
        deepNestedCategory: {
          sortedOrder: [{ title: 'deepNestedCategory', id: 'deepNestedCategory', file: '_index.md', filePath: '', weight: 0, content: '', date: new Date(), level: 2 }],
        },
      },
    };
    const items = service.prepareListItems(category);
    expect(items).toEqual([
      { title: 'test', id: 'test', class: '' },
      { title: 'nestedTest', id: 'nestedTest', class: '' },
      { title: 'deepNestedCategory', id: 'deepNestedCategory', class: 'table-contents-subheading-2' },
    ]);
  });
});
