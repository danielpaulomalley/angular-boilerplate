import { Component, ContentChild, HostBinding, Input, TemplateRef } from "@angular/core";
import { IDMInputDirective } from "../input/idmInput";
import { Subscription } from "rxjs";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

@Component({
  selector: 'idm-form-field',
  templateUrl: './idm-form-field.component.html',
  styleUrls: ['./idm-form-field.component.scss']
})
export class IDMFormFieldComponent {
  _label = ""
  _prefixIcon?: IconDefinition

  @ContentChild(IDMInputDirective) input?: IDMInputDirective

  @Input() set label(label: string) {
    this._label = label
  }
  @Input() set prefixIcon(v: IconDefinition) {

  }

  subs: Subscription[] = []


  constructor(

  ) {

  }

  ngAfterViewInit() {
    if (!this.input) return
    this.subs.push(this.input.hasValue$.subscribe(hasVal => {

    }))
  }

  ngOnDestroy() {
    for (const s of this.subs) s.unsubscribe()
  }
}