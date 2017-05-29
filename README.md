This project is forked from https://github.com/heltonandreazza/my-third-lib-seed.git.

# UserPermissions

The UserPermissions is service that provides methods for G7 platform permissions for Angular 2 projects.

## How it works

It uses the cookies to retrieve information. When any Senior Web App is deployed with the PAU (Senior Platform) it has access to its cookies, like:

- com.senior.pau.token
- com.senior.pau.services.url

The module, when initializing gets the access token for the current user from the cookies and also the default URL service.
The current token will be set to any http request, so even if the token has changed all the requests will be sent with a valid access token for the current user.
**P.S.** It doesn't mean the user has the rights to access a resource.

# Get permissions

The SERVER also offers the function *getPermissionTo* that verifies if the current user has permissions for a given action.
An *action* is a operation the user intend to proced, like: 

- *Visualizar*
- *Editar*
- *Excluir*
- *Processar*

However, the service *getPermissionTo* must be configured because it depends on the service/domain of the application and also the resource to be verified.
There is two ways you can configure it: 

- **Via parameters**: You can pass to it (besides the action) an *options* object with the values: 
  - *service*: The service the application refers to
  - *domain*: The domain the application belongs to
  - *resource*: The resource against which we want to verify the given action for the current user.

  **P.S.** The values *service*, *domain* and *resource* are concatenated like this: domain + '/' + service + '/' + resource. The result of that concatenation must to be something like: domain/service/resource. 

- **Via config**: Inject the UserPermissions service into you CoreModule or AppModule and set the domain, service and level by using setDomain(), setService() and setLevel() methods

You can pass to the function one action or an array of actions to be verified at once.

## How it works



### Configuring UserPermissions service

app/core/core.module.ts

```
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionService } from 'user-permissions/export';

@NgModule({
  imports: [CommonModule]
})
export class CoreModule {
  constructor(private permissionService: PermissionService) {
    permissionService.setDomain('hcm');
    permissionService.setService('pulse');
    permissionService.setLevel('actions');
  }
}

```

Doing this you need no longer worry about passing an option object.



## Usage

Verify only one action at a time: 

```
import { PermissionService } from 'user-permissions/export';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  userPermissions = {};
  constructor(private route: ActivatedRoute, private permissionService: PermissionService) { }

  ngOnInit() {
    this.permissionService.getPermissionTo("Visualizar", { resource: 'configuration' })
      .subscribe(userPermissions => this.userPermissions = userPermissions);
  }
}
```

Verify more than one action at once:

```
import { PermissionService } from 'user-permissions/export';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  userPermissions = {};
  constructor(private route: ActivatedRoute, private permissionService: PermissionService) { }

  ngOnInit() {
    this.permissionService.getPermissionTo(["Visualizar", "Editar"], { resource: 'configuration' })
      .subscribe(userPermissions => this.userPermissions = userPermissions);
  }
}
```


### Tips

A good practice is to *resolve* the permissions before entering the screen.
So if you are using angular router you can do it in the *app-routing*: 

First, you need to create a resolver

app/demo/demo.resolver.ts
```
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PermissionService } from 'user-permissions/export';

@Injectable()
export class DemoResolver implements Resolve<any> {
    constructor(private permissionService: PermissionService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.permissionService.getPermissionTo(["Visualizar", "VisualizarSatisfacaoPorPulso"], { resource: "panel" });

    }
}
``` 

Then, you can config the resolver in the app-routing.

app/app-routing.ts
```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoComponent } from "app/demo/demo.component";
import { DemoResolver } from "app/demo/demo.resolver";

const routes: Routes = [
    {
        path: "demo",
        component: DemoComponent,
        resolve: {
            userPermissions: DemoResolver,
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
```

And finally, in the component you can get the permissions from the route resolver: 

app/demo/demo.component.ts
```
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  userPermissions = {};
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    //getting permission from route resolver
    this.route.data.subscribe(({ userPermissions } = {}) => {
      this.userPermissions = userPermissions
    });
  }
}
```

You can also redirect to an error page if the user does not have the permission to visualize:

```
TODO
```

**P.S.** Refer to the error-pages documentation to know more about the *forbidden* error page. ```

## Contributors  

**@author:** 'Helton Andreazza *< [helton.prg@gmail.com](mailto:helton.prg@gmail.com) >*'   

## Credits

Project based on http://git.senior.com.br/design/ux-components
Library created based on https://medium.com/@OCombe/how-to-publish-a-library-for-angular-2-on-npm-5f48cdabf435