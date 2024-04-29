import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContentsComponent } from './table-contents.component';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import { TableContentsService } from './service/table-contents.service';
import { of } from 'rxjs';

describe('TableContentsComponent', () => {
  let component: TableContentsComponent;
  let fixture: ComponentFixture<TableContentsComponent>;
  let mockTableContentsService: TableContentsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableContentsComponent],
      providers: [
        MockProvider(ActivatedRoute, {
          params: of({ directory: 'test' }),
        }),
        MockProvider(TableContentsService, {
          getCategorizedTableContents: () =>
            of([
              {
                id: 'test',
                title: 'test',
                class: 'test-class',
              },
            ]),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableContentsComponent);
    mockTableContentsService = TestBed.inject(TableContentsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCategorizedTableContents with correct parameter', () => {
    const spy = jest.spyOn(mockTableContentsService, 'getCategorizedTableContents');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('test');
  });

  it('should emit correct value from tableContents$', (done) => {
    component.tableContents$?.subscribe((value) => {
      expect(value).toEqual([{ title: 'test', class: 'test-class', id: 'test', }]);
      done();
    });
  });
});
