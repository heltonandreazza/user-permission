import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoComponent } from "app/demo/demo.component";
import { DemoResolver } from "app/demo/demo.resolver";

@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    DemoResolver
  ]
})
export class DemoModule { }
