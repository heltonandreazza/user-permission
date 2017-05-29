import { Http } from "@angular/http";
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/forkJoin";
import 'rxjs/add/observable/throw';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";


@Injectable()
export class PermissionService {
  private domain: String;
  private service: String;
  private platformUrl: String;
  private authUrl: String;
  private level: String;

  /**
   * Setting up the default configs
   */
  constructor(private http: Http) {
    /*
     Depending on the project, the correct domain must be changed using setDomain() method preferentially on the CoreModule project, 
     or the domain must be seted every request using the @param config({ resource: 'whatever', domain: 'hcm' }) 
     from the getPermissionTo() method
    */
    this.domain = 'hcm';
    /*
     Depending on the project, the correct service must be changed using setService() method preferentially on the CoreModule project,
     or the domain must be seted every request using the @param config({ resource: 'whatever', service: 'pulse' }) 
     from the getPermissionTo() method
    */
    this.service = 'service';
    /*
     Depending on the project, the correct service must be changed using setLevel() method preferentially on the CoreModule project,
     or the domain must be seted every request using the @param config({ resource: 'whatever', level: 'actions' }) 
     from the getPermissionTo() method
    */
    this.level = 'actions';

    //this values shouldn't be changed
    this.platformUrl = this.getServiceUrl();
    this.authUrl = 'res://senior.com.br/';
  }

  setPlatformUrl(platformUrl: string) {
    this.platformUrl = platformUrl;
  }

  setDomain(domain: string) {
    this.domain = domain;
  }

  setService(service: string) {
    this.service = service;
  }

  setLevel(level: string) {
    this.level = level;
  }

  getPlatformUrl() {
    return this.platformUrl;
  }

  getDomain() {
    return this.domain;
  }

  getService() {
    return this.service;
  }

  getLevel() {
    return this.level;
  }

  /**
  * Default method for getting actions permissions accordingly with the current user
  * OBS: to run in development mode it's necessary to change it using the setDevelopmentMode method
  * @param action - an action or an array of actions which will be used to return wheather the user has or hasn't permission upon this action(s)
  * @param config - used to override the 'this' config above which contains the url, user, resource, domain, service and so on.
  */
  getPermissionTo(action, config = {}): Observable<any> {
    if (!action) return Observable.throw("You must specify an action");
    if (!config['resource']) return Observable.throw("You must specify a 'resource' attribute");

    //optionals
    const platformUrl = config['platformUrl'] || this.platformUrl;
    const authURL = config['authUrl'] || this.authUrl;
    const domainUrl = (config['domain'] || this.domain) + '/' + (config['service'] || this.service);
    const level = config['level'] || this.level;

    //not optionals
    const resource = config['resource'];

    //build params
    const endPoint = platformUrl + 'usuarios/userManager/' + level + '/verificaPermissao';

    const nomeUsuario = this.getPlatformUserData().username;
    const uriRecurso = authURL + domainUrl + '/' + resource;

    // call all actions http requests if it's an array, otherwise make just one unique call
    if (Array.isArray(action)) {
      let isBack = 0;
      let isRejected = false;
      let permissions = {};
      let requests = [];

      //insert every action request into array of requests
      action.forEach(ac => {
        let params = { nomeUsuario, uriRecurso, nomeAcao: ac };
        requests.push(
          this.http.post(endPoint, params).map(res => res.json())
        );
      });

      //send requests
      return Observable.forkJoin(requests)
        .map((responses: any[]) => {
          //treatment of all requests results into array of requests
          let result = {};
          responses.forEach((res, index) => Object.assign(result, { [action[index].toLowerCase()]: res.permitido }));
          return result;
        })
        .catch(error => {
          //TODO: change to the forbidden route
          return Observable.throw(error)
        });
    } else {
      let params = { nomeUsuario, uriRecurso, nomeAcao: action };
      //send unique request
      return this.http.post(endPoint, params)
        .map(response => {
          let permissions = {};
          permissions[action.toLowerCase()] = response.json().permitido;
          return permissions;
        })
        .catch(error => Observable.throw(error));
    }
  }

  /**
   * Method to get the data from the platform services url
   */
  private getServiceUrl() {
    try {
      return decodeURIComponent(this.getCookieValue("com.senior.pau.services.url"));
    } catch (e) {
      console.log("Erro ao obter Service URL");
    }
    return null;
  }

  /**
   * Method to get the data from the current logged user
   */
  private getPlatformUserData() {
    /* 
      In previous versions of the platform we need to double parse the userData cookies, 
      but in newest vesrions wee do not need to do this anymore
    */
    let userData = (this.getCookieValue('com.senior.pau.userdata') || '{}');
    userData = JSON.parse(decodeURIComponent(userData.replace(/\+/g, " ")));
    return typeof userData === 'object' ? userData : JSON.parse(userData);
  }

  private getCookieValue(key: string): string {
    let value = document.cookie.split(";")
      .find(value => value.indexOf(key) >= 0);
    return value.split("=")[1];
  }

  getGeoNames() {
    return this.http.get('http://www.geonames.org/childrenJSON?geonameId=3469034')
      .map(response => {
        return response.json().geonames;
      });
  }
}