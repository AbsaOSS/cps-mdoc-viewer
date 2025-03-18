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

import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  EnvironmentInjector,
  Inject,
  OnInit,
  createComponent
} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { map, Observable, tap } from 'rxjs';
import { TableContentsComponent } from '../table-contents/table-contents.component';
import { MarkdownFile } from '../../models/categories.interface';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CpsDividerComponent, CpsTableComponent } from 'cps-ui-kit';
import {
  CONFIG_INJECTION_TOKEN,
  CPSMDocViewerConfig
} from '../../config/config';
import { parseTableData } from '../../utils/parse-table-data.util';

@Component({
  selector: 'app-markdown-viewer',
  imports: [
    MarkdownComponent,
    TableContentsComponent,
    CommonModule,
    CpsDividerComponent,
    CpsTableComponent
  ],
  templateUrl: './markdown-viewer.component.html',
  styleUrl: './markdown-viewer.component.scss'
})
export class MarkdownViewerComponent implements OnInit {
  markdownFiles$: Observable<MarkdownFile[]> | undefined;
  markdownFilesToRender = 0;
  tablesReplaced = false;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    @Inject(CONFIG_INJECTION_TOKEN) protected libConfig: CPSMDocViewerConfig,
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.markdownFiles$ = this.route.data.pipe(
      map((data) => data['markdownFiles']),
      tap((markdownData) => {
        if (!this.route.snapshot.fragment) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
        this.markdownFilesToRender = markdownData.length;
        if (markdownData && markdownData[0]?.title) {
          this.title.setTitle(
            `${markdownData[0].title} - ${this.libConfig.pageTitle}`
          );
        } else {
          this.title.setTitle(this.libConfig.pageTitle);
        }
      })
    );
  }

  markdownRendered(): void {
    this.markdownFilesToRender--;
    if (this.markdownFilesToRender === 0) {
      this._replaceTablesWithComponents();
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        const targetSection = document.querySelector(
          '#' + CSS.escape(fragment)
        ) as HTMLElement;
        if (targetSection) {
          setTimeout(() => {
            window.scrollTo({
              top:
                targetSection.offsetTop -
                (document.querySelector('.navbar')?.getBoundingClientRect()
                  .height ?? 0),
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    }
  }

  /**
   * Replaces tables that are inside .cps-table divs with CpsTableComponents
   */
  private _replaceTablesWithComponents(): void {
    const tables: NodeListOf<HTMLTableElement> =
      document.querySelectorAll('.cps-table > table');

    tables.forEach((table) => {
      const parentDiv = table.parentElement;
      const tableData = parseTableData(table);
      const cpsTableRef = createComponent(CpsTableComponent, {
        environmentInjector: this.environmentInjector
      });

      cpsTableRef.setInput('renderDataAsHTML', true);
      cpsTableRef.setInput('data', [...tableData.data]);
      cpsTableRef.setInput(
        'columns',
        [...tableData.columns].map((col) => ({ ...col }))
      );
      cpsTableRef.setInput(
        'hasToolbar',
        parentDiv?.classList.contains('searchable')
      );
      cpsTableRef.setInput(
        'showGlobalFilter',
        parentDiv?.classList.contains('searchable')
      );
      cpsTableRef.setInput(
        'sortable',
        parentDiv?.classList.contains('sortable')
      );
      cpsTableRef.setInput(
        'filterableByColumns',
        parentDiv?.classList.contains('filterableByColumns')
      );
      cpsTableRef.setInput(
        'paginator',
        parentDiv?.classList.contains('paginator')
      );
      cpsTableRef.setInput(
        'bordered',
        parentDiv?.classList.contains('bordered')
      );

      table.parentElement?.insertBefore(
        cpsTableRef.location.nativeElement,
        table
      );
      table.remove();
      this.appRef.attachView(cpsTableRef.hostView);
    });
    this.changeDetectorRef.detectChanges();
    this.tablesReplaced = true;
  }
}
