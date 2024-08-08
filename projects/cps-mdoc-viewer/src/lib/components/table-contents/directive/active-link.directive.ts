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

import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  OnDestroy,
  afterRender,
  Input
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Subject, Subscription, takeUntil } from 'rxjs';
import { Location } from '@angular/common';

export interface ListItem {
  title: string;
  id: string;
  class: string;
}

@Directive({
  selector: '[appActiveLink]',
  standalone: true
})
export class ActiveLinkDirective implements OnDestroy {
  @Input() set appActiveLink(items: ListItem[]) {
    if (items.length) {
      setTimeout(() => {
        this.setupItemsAndSections();
        this.setupClickListeners();
      });
    }
  }

  private listItems: NodeListOf<HTMLAnchorElement> | undefined;
  private sections: Element[] = [];
  private navbarHeight = 0;
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];
  private anchorDebounceTimeout: number | null = null;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private location: Location
  ) {
    afterRender({
      read: () => {
        this.getNavbarHeight();
      }
    });
  }

  // We can consider replacing this with fixed value as the navbar seems to always have height of 66px
  // (except for very narrow screen width, < 249px wide)
  getNavbarHeight() {
    const navbar = document.querySelector('.navbar');
    this.navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
  }

  setupItemsAndSections() {
    this.listItems = this.elementRef.nativeElement.querySelectorAll(
      '.list-unstyled li a'
    );

    if (this.listItems) {
      this.sections = Array.from(this.listItems).map(
        (item) =>
          this.getElementByUnescapedId(item.getAttribute('href')!.substring(1))!
      );
    }
  }

  setupClickListeners() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.listItems?.forEach((item) => {
      const click$ = fromEvent(item, 'click').pipe(takeUntil(this.destroy$));
      this.subscriptions.push(
        click$.subscribe((e: Event) => this.handleItemClick(e))
      );
    });
  }

  handleItemClick(e: Event): void {
    e.preventDefault();
    const targetSection = this.getElementByUnescapedId(
      (e.target as HTMLElement).getAttribute('href')!.substring(1)
    );
    window.scrollTo({
      top: (targetSection?.offsetTop || 0) - this.navbarHeight,
      behavior: 'smooth'
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    let activeSet = false;
    this.sections.forEach((section, index) => {
      if (section) {
        const rect = section.getBoundingClientRect();
        // 32px (2rem) is the distance between sections
        if (
          rect.top - 1 <= this.navbarHeight &&
          rect.bottom + 32 >= this.navbarHeight
        ) {
          this.removeActiveClassFromAllItems();
          const parentElement = this.listItems?.[index].parentElement;
          if (parentElement) {
            this.renderer.addClass(parentElement, 'active');
            activeSet = true;
            if (this.listItems?.[index].getAttribute('href')) {
              this.setUrlFragment(
                this.listItems?.[index]
                  .getAttribute('href')
                  ?.substring(1) as string
              );
            }
          }
        }
      }
    });

    // If none of the sections are active, remove the active class from all items (it means we're above the first section)
    if (!activeSet) {
      this.removeActiveClassFromAllItems();
      this.setUrlFragment('');
    }
  }

  setUrlFragment(fragment: string): void {
    if (this.anchorDebounceTimeout !== null) {
      clearTimeout(this.anchorDebounceTimeout);
    }
    this.anchorDebounceTimeout = setTimeout(() => {
      const urlTree = this.router.createUrlTree(
        [],
        fragment ? { fragment } : undefined
      );
      this.location.replaceState(urlTree.toString());
    }, 100);
  }

  getElementByUnescapedId(unescapedId: string): HTMLElement | null {
    return document.querySelector('#' + CSS.escape(unescapedId));
  }

  removeActiveClassFromAllItems(): void {
    this.listItems?.forEach(
      (item) =>
        item.parentElement &&
        this.renderer.removeClass(item.parentElement, 'active')
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
