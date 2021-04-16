import { Component, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'GU-member-table',
  templateUrl: './member-table.component.html',
  styleUrls: ['./member-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class MemberTableComponent {
  @Input() members: any;

  displayedColumns: string[] = ['name', 'DOB', 'detail'];
  expandedMember: expandedColumns | null;

  constructor(
    private router: Router
  ) { }

  memberDetail(): void {
    this.router.navigate([`/member-detail/{{member.id}}`])
  }

}

export interface expandedColumns {
  name: string;
  DOB: number;
  time: number;
  photoUrl: string
}