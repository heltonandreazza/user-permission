import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styles: []
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
