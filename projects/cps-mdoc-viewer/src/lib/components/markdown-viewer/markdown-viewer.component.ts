import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { map, Observable, tap } from 'rxjs';
import { TableContentsComponent } from '../table-contents/table-contents.component';
import { MarkdownFile } from '../../models/categories.interface';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
// import { PAGE_TITLE } from '../../app.component';
import { CpsDividerComponent } from 'cps-ui-kit';

const PAGE_TITLE = 'Sample page title, todo move to DI';

@Component({
  selector: 'app-markdown-viewer',
  standalone: true,
  imports: [MarkdownComponent, TableContentsComponent, CommonModule, CpsDividerComponent],
  templateUrl: './markdown-viewer.component.html',
  styleUrl: './markdown-viewer.component.scss',
})
export class MarkdownViewerComponent implements OnInit {
  markdownFiles$: Observable<MarkdownFile[]> | undefined;
  markdownFilesToRender = 0;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
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
          this.title.setTitle(`${markdownData[0].title} - ${PAGE_TITLE}`);
        } else {
          this.title.setTitle(PAGE_TITLE);
        }
      }),
    );
  }

  markdownRendered(): void {
    this.markdownFilesToRender--;
    if (this.markdownFilesToRender === 0) {
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        const targetSection = document.querySelector('#' + CSS.escape(fragment)) as HTMLElement;
        if (targetSection) {
          setTimeout(() => {
            window.scrollTo({
              top: targetSection.offsetTop - (document.querySelector('.navbar')?.getBoundingClientRect().height ?? 0),
              behavior: 'smooth',
            });
          }, 100);
        }
      }
    }
  }
}
