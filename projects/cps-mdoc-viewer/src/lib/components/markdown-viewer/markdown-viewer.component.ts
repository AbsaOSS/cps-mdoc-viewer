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

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { map, Observable, tap } from 'rxjs';
import { TableContentsComponent } from '../table-contents/table-contents.component';
import { MarkdownFile } from '../../models/categories.interface';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
// import { CpsDividerComponent } from 'cps-ui-kit';
import {
  CONFIG_INJECTION_TOKEN,
  CPSMDocViewerConfig
} from '../../config/config';

@Component({
  selector: 'app-markdown-viewer',
  standalone: true,
  imports: [
    MarkdownComponent,
    TableContentsComponent,
    CommonModule
    // CpsDividerComponent
  ],
  templateUrl: './markdown-viewer.component.html',
  styleUrl: './markdown-viewer.component.scss'
})
export class MarkdownViewerComponent implements OnInit {
  markdownFiles$: Observable<MarkdownFile[]> | undefined;
  markdownFilesToRender = 0;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    @Inject(CONFIG_INJECTION_TOKEN) protected libConfig: CPSMDocViewerConfig,
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.markdownFiles$ = this.route.data.pipe(
      map((data) => data['markdownFiles']),
      tap((markdownData) => {
        if (!this.route.snapshot.fragment) {
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
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
}
