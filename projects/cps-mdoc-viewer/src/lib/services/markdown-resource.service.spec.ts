import { TestBed } from '@angular/core/testing';

import { MarkdownResourceService } from './markdown-resource.service';
import { MockProvider } from 'ng-mocks';
import { CategoriesDataService } from './categories-data.service';
import { of } from 'rxjs';

describe('MarkdownResourceService', () => {
  let service: MarkdownResourceService;
  const fixedDate = new Date('2022-01-01T00:00:00Z');
  const mockCategories = {
    sortedOrder: ['docs'],
    docs: {
      sortedOrder: [
        {
          title: 'test',
          file: '_index.md',
          filePath: '',
          weight: 0,
          content: '',
          date: fixedDate
        },
        'nestedCategory'
      ],
      nestedCategory: {
        sortedOrder: [
          {
            title: 'nestedTest',
            file: '_index.md',
            filePath: '',
            weight: 0,
            content: '',
            date: fixedDate
          }
        ]
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(CategoriesDataService, {
          getCategories: () => of(mockCategories)
        })
      ]
    });
    service = TestBed.inject(MarkdownResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get markdown files', (done) => {
    service.getMarkdownFiles('docs').subscribe((files) => {
      expect(files).toEqual([
        {
          title: 'test',
          file: '_index.md',
          filePath: '',
          weight: 0,
          content: '',
          date: fixedDate
        },
        {
          title: 'nestedTest',
          file: '_index.md',
          filePath: '',
          weight: 0,
          content: '',
          date: fixedDate
        }
      ]);
      done();
    });
  });
});
