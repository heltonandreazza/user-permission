import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DemoComponent } from "./demo/demo.component";
import { DemoModule } from "./demo/demo.module";
import { DemoResolver } from "./demo/demo.resolver";
import { PermissionModule } from './permission/permission.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DemoModule,
    PermissionModule,
    RouterModule.forRoot([
      {
        path: '',
        component: DemoComponent,
        resolve: {
          userPermissions: DemoResolver
        }
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
