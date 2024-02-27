import { Component, Input } from "@angular/core";

@Component({
  selector: 'idm-select',
  templateUrl: './idm-select.component.html',
  styleUrls: ['./idm-select.component.scss']
})
export class IDMSelectComponent {
  @Input() multiple = false



  constructor(

  ) {}
}