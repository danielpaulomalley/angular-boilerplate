import { NgModule } from "@angular/core";
import { GlobalizationPipe } from "./globalization.pipe";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AMAGWidgetsModule } from "./components/widgets/amag-widgets.module";

@NgModule({
  declarations: [
    GlobalizationPipe
  ],
  exports: [
    GlobalizationPipe,
    AMAGWidgetsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule {}