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

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TableContentsService } from './service/table-contents.service';
import {
  ActiveLinkDirective,
  ListItem
} from './directive/active-link.directive';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-table-contents',
    imports: [CommonModule, ActiveLinkDirective],
    templateUrl: './table-contents.component.html',
    styleUrl: './table-contents.component.scss'
})
export class TableContentsComponent implements OnInit {
  tableContents$: Observable<ListItem[]> | undefined;
  constructor(
    private tableContentsService: TableContentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const selectedDirectory = params['directory'];
      this.tableContents$ =
        this.tableContentsService.getCategorizedTableContents(
          selectedDirectory
        );
    });
  }
}
