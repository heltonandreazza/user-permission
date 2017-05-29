import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionService } from './permission.service';

@NgModule({
  providers: [
    PermissionService
  ],
  imports: [
    CommonModule
  ],
  declarations: []
})
export class PermissionModule { }
