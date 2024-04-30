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
          params: of({ directory: 'test' })
        }),
        MockProvider(TableContentsService, {
          getCategorizedTableContents: () =>
            of([
              {
                id: 'test',
                title: 'test',
                class: 'test-class'
              }
            ])
        })
      ]
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
    const spy = jest.spyOn(
      mockTableContentsService,
      'getCategorizedTableContents'
    );
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith('test');
  });

  it('should emit correct value from tableContents$', (done) => {
    component.tableContents$?.subscribe((value) => {
      expect(value).toEqual([
        { title: 'test', class: 'test-class', id: 'test' }
      ]);
      done();
    });
  });
});
