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
  standalone: true,
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
