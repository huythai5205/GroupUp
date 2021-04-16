import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Event, Pagination } from '../../models';

@Component({
  selector: 'GU-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() event: Event[];
  @Input() pagination: Pagination;

  pageEvent: PageEvent;
  pageNumber: number = 1;
  pageSize: number = 5;

  constructor() { }

  pageChanged(event: any): void {
    this.pageNumber = event.page;
  }

}