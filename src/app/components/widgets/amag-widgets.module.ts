import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IDMFormFieldComponent } from "./form-field/idm-form-field.component";
import { IDMInputDirective } from "./input/idmInput";
import { AMAGButtonDirective } from "./button/amag-button";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    IDMFormFieldComponent,
    IDMInputDirective,
    AMAGButtonDirective
  ],
  exports: [
    IDMFormFieldComponent,
    IDMInputDirective,
    AMAGButtonDirective
  ]
})
export class AMAGWidgetsModule {}