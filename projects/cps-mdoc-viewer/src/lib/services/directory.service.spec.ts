import { TestBed } from '@angular/core/testing';

import { DirectoryService } from './directory.service';
import { MockProvider } from 'ng-mocks';
import { CategoriesDataService } from './categories-data.service';
import { of } from 'rxjs';
import { Category } from '../models/categories.interface';
import { DirectoryToolbarInfo } from '../models/directory-toolbar-info.interface';

describe('DirectoryService', () => {
  let service: DirectoryService;
  const mackCategories: Category = {
    sortedOrder: ['docs', 'features'],
    docs: {
      sortedOrder: [
        {
          toolbar_title: 'Getting Tested',
        },
      ],
    },
    features: {
      sortedOrder: [
        {
          title: 'Testing features',
        },
      ],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(CategoriesDataService, { getCategories: () => of(mackCategories) })],
    });
    service = TestBed.inject(DirectoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return top level directories', (done) => {
    const expectedResult = [
      {
        toolbar_title: 'Getting Tested',
        directory: 'docs',
      },
      {
        toolbar_title: 'features',
        directory: 'features',
      },
    ];
    service.getTopLevelDirectories().subscribe((directories: DirectoryToolbarInfo[]) => {
      expect(directories).toEqual(expectedResult);
      done();
    });
  });

  it('should return first directory', (done) => {
    const expectedFirstDirectory = {
      toolbar_title: 'Getting Tested',
      directory: 'docs',
    };
    service.getFirstDirectory().subscribe((directory) => {
      expect(directory).toEqual(expectedFirstDirectory);
      done();
    });
  });
});
