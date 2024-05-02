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

import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MarkdownViewerComponent } from './markdown-viewer.component';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, take } from 'rxjs';
import { TableContentsComponent } from '../table-contents/table-contents.component';
import { MarkdownResourceService } from '../../services/markdown-resource.service';
import { MarkdownModule } from 'ngx-markdown';
import { Title } from '@angular/platform-browser';
import { CpsDividerComponent } from 'cps-ui-kit';
import { CONFIG_INJECTION_TOKEN } from '../../config/config';

describe('MarkdownViewerComponent', () => {
  globalThis.window.scrollTo = jest.fn();

  let component: MarkdownViewerComponent;
  let fixture: ComponentFixture<MarkdownViewerComponent>;
  const activatedRouteSubject = new BehaviorSubject({
    markdownFiles: [
      { title: 'Test Title', description: 'Test Description', date: new Date() }
    ]
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MarkdownViewerComponent,
        MockComponent(TableContentsComponent),
        MockModule(MarkdownModule),
        MockComponent(CpsDividerComponent)
      ],
      providers: [
        MockProvider(MarkdownResourceService),
        MockProvider(ActivatedRoute, {
          data: activatedRouteSubject,
          snapshot: {} as any
        }),
        MockProvider(Title, { setTitle: jest.fn() }),
        {
          provide: CONFIG_INJECTION_TOKEN,
          useValue: {
            headerTitle: 'Test Training Documentation',
            pageTitle: 'Test Training Documentation'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set markdownFiles$ correctly from ActivatedRoute data', (done) => {
    component.markdownFiles$?.pipe(take(1)).subscribe((files) => {
      expect(files.length).toBe(1);
      expect(files[0]['title']).toBe('Test Title');
      expect(files[0]['description']).toBe('Test Description');
      done();
    });
  });

  it('should page title correctly based on the markdown files data', fakeAsync(() => {
    const titleService = TestBed.inject(Title);
    activatedRouteSubject.next({
      markdownFiles: [
        {
          title: 'New Updated Title!',
          description: 'Test Description',
          date: new Date()
        }
      ]
    });

    expect(titleService.setTitle).toHaveBeenCalledTimes(2);
    expect(titleService.setTitle).toHaveBeenCalledWith(
      'Test Title - Test Training Documentation'
    );
    expect(titleService.setTitle).toHaveBeenCalledWith(
      'New Updated Title! - Test Training Documentation'
    );
  }));
});
