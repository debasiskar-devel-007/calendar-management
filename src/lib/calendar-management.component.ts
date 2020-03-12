import { Component, OnInit, Input, Inject } from '@angular/core';
import { CreateSlotComponent } from './components/create-slot/create-slot.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'lib-calendar-management',
  templateUrl: './calendar-management.component.html',
  styleUrls: ['./calendar-management.component.css']
})
export class CalendarManagementComponent implements OnInit {

  public libConfigData: any = {};
  /* Get data from input */
  @Input()
  set configData(configData: any) {
    this.libConfigData = configData;
    console.log(">>>>>>>", this.libConfigData);
  }

  constructor(public activeRoute: ActivatedRoute, public router: Router, public matDialog: MatDialog) { }

  ngOnInit() {
  }

  redirect(flag: string) {
    switch(flag) {
      case 'view':
        this.router.navigateByUrl(this.libConfigData.urls.view);
        break;
      case 'event-list':
        this.router.navigateByUrl(this.libConfigData.urls.eventListing);
        break;
      case 'create':
        this.router.navigateByUrl(this.libConfigData.urls.add);
        break;
      case 'sync-google':
        this.router.navigateByUrl(this.libConfigData.urls.googleSync);
        break;
    }
  }

}
