import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class DemoResolver implements Resolve<any> {
    constructor(private permissionService: PermissionService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.permissionService.getPermissionTo(["Visualizar", "VisualizarSatisfacaoPorPulso"], { resource: "panel" });

    }
}