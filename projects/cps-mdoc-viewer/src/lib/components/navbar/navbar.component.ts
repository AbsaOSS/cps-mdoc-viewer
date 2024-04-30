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
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  viewChild
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { DirectoryService } from '../../services/directory.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DirectoryToolbarInfo } from '../../models/directory-toolbar-info.interface';
import { CpsIconComponent } from 'cps-ui-kit';
import {
  CONFIG_INJECTION_TOKEN,
  CPSMDocViewerConfig
} from '../../lib.provider';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CpsIconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  categories$: Observable<DirectoryToolbarInfo[]> | undefined;
  scrollPercent = 0;
  navbarMenu = viewChild<ElementRef>('navbarMenu');
  navbarMenuTransitioning = false;

  constructor(
    private directoryService: DirectoryService,
    @Inject(CONFIG_INJECTION_TOKEN) protected libConfig: CPSMDocViewerConfig
  ) {}

  ngOnInit(): void {
    this.categories$ = this.directoryService.getTopLevelDirectories().pipe(
      map((directoriesInfo) =>
        directoriesInfo.map((directory) => ({
          toolbar_title: this.capitalizeFirstLetter(directory.toolbar_title),
          directory: directory.directory
        }))
      )
    );
  }
  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // check if user has scrolled down
    this.trackReadPercentage();
  }

  toggleNavbarMenu(): void {
    if (this.navbarMenuTransitioning) {
      return;
    }

    if (!this.navbarMenu()?.nativeElement.classList.contains('show')) {
      this.showNavbarMenu();
    } else {
      this.hideNavbarMenu();
    }
  }

  private showNavbarMenu(): void {
    const navBarMenuElement: HTMLElement = this.navbarMenu()?.nativeElement;
    navBarMenuElement.classList.remove('collapse');
    navBarMenuElement.classList.add('collapsing');
    navBarMenuElement.style['height'] = '0';

    this.navbarMenuTransitioning = true;

    setTimeout(() => {
      navBarMenuElement.classList.remove('collapsing');
      navBarMenuElement.classList.add('collapse', 'show');
      navBarMenuElement.style['height'] = '';
      this.navbarMenuTransitioning = false;
    }, 350);

    navBarMenuElement.style['height'] = navBarMenuElement.scrollHeight + 'px';
  }

  private hideNavbarMenu(): void {
    const navBarMenuElement: HTMLElement = this.navbarMenu()?.nativeElement;
    navBarMenuElement.style['height'] =
      navBarMenuElement.getBoundingClientRect().height + 'px';
    // Force reflow by evaluating offsetHeight
    // see https://stackoverflow.com/questions/9016307/force-reflow-in-css-transitions-in-bootstrap
    navBarMenuElement.offsetHeight;
    navBarMenuElement.classList.add('collapsing');
    navBarMenuElement.classList.remove('collapse', 'show');

    this.navbarMenuTransitioning = true;

    setTimeout(() => {
      navBarMenuElement.classList.remove('collapsing');
      navBarMenuElement.classList.add('collapse');
      this.navbarMenuTransitioning = false;
    }, 350);

    navBarMenuElement.style['height'] = '';
  }

  private trackReadPercentage(): void {
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    // 84px is footer's height
    const totalDocScrollLength = docHeight - windowHeight - 84;
    let scrollPercent = 0;
    // Check if totalDocScrollLength is 0 or less
    if (totalDocScrollLength <= 0) {
      scrollPercent = 0;
    } else {
      scrollPercent = Math.floor((scrollTop / totalDocScrollLength) * 100);
    }
    // Check if scrollPercent is negative
    if (scrollPercent < 0) {
      scrollPercent = 0;
    }

    this.scrollPercent = scrollPercent;
  }
}
