import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'GU-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  editForm: UntypedFormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
