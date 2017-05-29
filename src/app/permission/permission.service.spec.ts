import { TestBed, inject } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import "rxjs/add/operator/catch";

import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionService]
    });
  });

  it('should be created', inject([PermissionService], (service: PermissionService) => {
    expect(service).toBeTruthy();
  }));

  it('should be configurated', inject([PermissionService], (service: PermissionService) => {
    service.setPlatformUrl('');
    service.setDomain('hcm');
    service.setService('pulse')
    service.setLevel('actions');

    expect(service.getPlatformUrl()).toEqual('');
    expect(service.getDomain()).toEqual('hcm');
    expect(service.getService()).toEqual('pulse');
    expect(service.getLevel()).toEqual('actions');
  }));

  it('should return action inconsistence', inject([PermissionService], (service: PermissionService) => {
    service.getPermissionTo(undefined, undefined)
      .subscribe(
      success => console.log(success),
      error => expect(error.getMessage()).toBe('You must specify an action'));
  }));
});
