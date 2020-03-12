import {Component, Inject, Input, OnInit} from '@angular/core';
import moment from 'moment-es6';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar, MatTableDataSource} from '@angular/material';
import {FormControl} from '@angular/forms';
import {HttpRequestService} from '../../services/http-request.service';
import {CookieService} from 'ngx-cookie-service';
import {success} from 'ng-packagr/lib/util/log';
import {EditEventComponent} from '../listing/listing.component';
import {BookEventComponent} from '../view-slot-user/view-slot-user.component';

@Component({
  selector: 'lib-view-slot',
  templateUrl: './view-slot.component.html',
  styleUrls: ['./view-slot.component.css']
})
export class ViewSlotComponent implements OnInit {

  public libConfigData: any = {};
  /* Search fields */
  public filterOptions: any = {
    availableDates: '',
    eventType: '',
    timezone: ''
  };
  // public availableDates: any = '';
  // public eventType: any = '';
  // public timezone: any = '';

  public loading: boolean;

  public searchData: any;

  /* Variable for pagination */
  public page: any = {
    start: 1,
    end: 20,
    page_count: 20,
    page_no: 1,
    total_record: 0
  };
  public itemCount: any = 20;
  public arrPage: any = [];
  public jumpToPageNumber: any = 0;

  /* Get data from input */
  @Input()
  set configData(configData: any) {
    this.libConfigData = configData;
  }

  constructor(private httpRequest: HttpRequestService, public snackBar: MatSnackBar,
              public cookieService: CookieService, public matDialog: MatDialog) {
  }

  ngOnInit() {
    this.getPageCount();
    if (this.cookieService.check('timezone')) {
      this.filterOptions.timezone = this.cookieService.get('timezone');
    } else {
      this.filterOptions.timezone = '-05:00|America/Chicago';
    }
  }

  /*
   * getPageCount() count total number of records found in the collection
   */
  getPageCount() {
    let data: any;
    if (this.searchData == null) {
      data = {
        token: this.libConfigData.jwtToken,
        condition: {}
      };
    } else {
      data = this.searchData;
    }
    this.httpRequest.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.countSlot, data).subscribe((response) => {
      if (response.status == 'success') {
        console.log(response);
        /* Update value of this.page */
        this.page.total_record = response.data;
        if (this.page.total_record < this.page.page_count) {
          this.page.end = this.page.total_record;
        } else {
          this.page.end = this.page.page_count;
        }

        /* Create page array */
        this.arrPage = [];
        for (let i = 0; i <= this.page.total_record / this.page.page_count; i++) {
          this.arrPage.push(i + 1);
        }
      } else {
        console.log(response);
      }
    });
  }

  /*
   * pageStep is the function to step forward and backward the page
   * Load next or previous n(page.page_count) items
   */
  pageStep(flag: string = null) {
    let data: any;

    if (flag == 'prev' && this.page.page_no > 1) {
      this.loading = true;
      data = {
        token: this.libConfigData.jwtToken,
        skip: this.page.start - this.page.page_count - 1,
        limit: this.page.page_count,
        timezone: this.filterOptions.timezone
      };
    }

    if (flag == 'next' && (this.page.end < this.page.total_record)) {
      this.loading = true;
      data = {
        token: this.libConfigData.jwtToken,
        skip: this.page.end,
        limit: this.page.page_count,
        timezone: this.filterOptions.timezone
      };
    }

    /*
     * If the data variable is uninitialized there is no need to execute the httpRequest
     */
    if (data != null) {
      /* If there has a search value then it must be include the search condition with data */
      if (this.searchData != null) {
        data.condition = this.searchData.condition;
      }

      this.httpRequest.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.viewEventSlots, data).subscribe((response) => {
        if (response.status == 'success') {
          this.libConfigData.responseData = response.data;
          this.changePage(flag);
        } else {
          console.log('response', response);
        }
        this.loading = false;
      });
    }
  }

  /*
   * Function for changing page variables along with the pageStep
   */
  changePage(cflag) {
    switch (cflag) {
      /* case 'next' will execute when pageStep('next') execute or on click of forward button */
      case 'next':
        this.page.page_no++;
        this.jumpToPageNumber++;
        this.page.start = this.page.start + this.page.page_count;
        if (this.page.end + this.page.page_count <= this.page.total_record) {
          this.page.end = this.page.end + this.page.page_count;
        } else {
          this.page.end = this.page.total_record;
        }
        break;

      /* case 'prev' will execute when pageStep('prev') execute or on click of backward button */
      case 'prev':
        this.page.page_no--;
        this.jumpToPageNumber--;
        this.page.end = this.page.start - 1;
        this.page.start = this.page.start - this.page.page_count;
        break;
    }
  }


  /*
   * Change the page count value and reload items with the changed value
   */
  onChangePageCount() {
    console.log('onChangePageCount() executing', this.itemCount);
    this.loading = true;
    let data: any = {
      token: this.libConfigData.jwtToken,
      skip: 0,
      limit: parseInt(this.itemCount),
      timezone: this.filterOptions.timezone
    };
    /* If there has a search value then it must be include the search condition with data */
    if (this.searchData != null) {
      data.condition = this.searchData.condition;
    }

    this.httpRequest.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.viewEventSlots, data).subscribe((response) => {
      if (response.status == 'success') {
        // this.ngOnInit();
        this.libConfigData.responseData = response.data;
        this.page.start = 1;
        if (parseInt(this.itemCount) < this.page.total_record) {
          this.page.end = parseInt(this.itemCount);
        } else {
          this.page.end = this.page.total_record;
        }
        this.page.page_count = parseInt(this.itemCount);
        this.page.page_no = 1;
        this.jumpToPageNumber = 0;

        /* Create page array */
        this.arrPage = [];
        for (let i = 0; i <= this.page.total_record / this.page.page_count; i++) {
          this.arrPage.push(i + 1);
        }
      } else {
        console.log('response', response);
      }
      this.loading = false;
    });
  }


  /*
   * jumpToPage() directly take into the page that calculates for the current page_count
   */
  jumpToPage() {
    this.loading = true;
    let data: any = {
      token: this.libConfigData.jwtToken,
      skip: this.page.page_count * this.jumpToPageNumber,
      limit: this.page.page_count,
      timezone: this.filterOptions.timezone
    };
    /* If there has a search value then it must be include the search condition with data */
    if (this.searchData != null) {
      data.condition = this.searchData.condition;
    }

    this.httpRequest.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.viewEventSlots, data).subscribe((response) => {
      if (response.status == 'success') {
        this.libConfigData.responseData = response.data;

        this.page.page_no = this.jumpToPageNumber + 1;
        this.page.start = (this.page.page_count * this.jumpToPageNumber) + 1;
        if ((this.page.page_count * this.jumpToPageNumber) + this.page.page_count < this.page.total_record) {
          this.page.end = (this.page.page_count * this.jumpToPageNumber) + this.page.page_count;
        } else {
          this.page.end = this.page.total_record;
        }
      } else {
        console.log('response', response);
      }
      this.loading = false;
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  search() {
    this.searchData = {
      condition: {},
      token: this.libConfigData.jwtToken,
      timezone: this.filterOptions.timezone
    };
    if (this.filterOptions.availableDates != '') {
      this.searchData.condition.$and = [{start_datetime_unix: {$gte: moment(this.filterOptions.availableDates.begin).subtract(1, 'days').valueOf()}},
        {start_datetime_unix: {$lte: moment(this.filterOptions.availableDates.end).add(1, 'days').valueOf()}}];

      // data.condition.end_date = {
      //   $lte: moment(this.availableDates.end).format('L')
      // };
    }

    if (this.filterOptions.eventType != '') {
      this.searchData.condition.event_type = this.filterOptions.eventType;
    }

    this.loading = true;
    this.httpRequest.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.viewEventSlots, this.searchData).subscribe((response) => {
      if (response.data.length == 0) {
        this.openSnackBar('No event found', null);
      }
      if (response.status == 'success') {
        this.page.start = 1;
        if (response.data.length > this.page.page_count) {
          this.page.end = this.page.page_count;
        } else {
          this.page.end = response.data.length;
        }
        this.page.page_no = 1;
        this.jumpToPageNumber = 0;
      }
      this.libConfigData.responseData = response.data;
      this.loading = false;
    });

    this.getPageCount();
  }


  /*
   * resetFilter() reset the search fields and reloads data without any condition
   */
  resetFilter() {
    this.loading = true;

    /* Reset searchData value to 'null' and filterOptions value to blank('')*/
    this.searchData = null;
    this.filterOptions.availableDates = '';
    this.filterOptions.eventType = '';

    /* Create data object */
    let data: any = {
      token: this.libConfigData.jwtToken,
      skip: 0,
      limit: this.page.page_count,
      timezone: this.filterOptions.timezone
    };
    this.httpRequest.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.viewEventSlots, data).subscribe((response) => {
      if (response.status == 'success') {
        this.page.start = 1;
        this.page.end = this.page.page_count;
        this.page.page_no = 1;
        this.jumpToPageNumber = 0;
        this.libConfigData.responseData = response.data;
        this.loading = false;
      } else {
        this.openSnackBar('Something went wrong. Please try again.', null);
      }
    });

    this.getPageCount();
  }


  onChangeTimezone(event: any) {
    this.loading = true;
    this.cookieService.set('timezone', this.filterOptions.timezone);

    /* Create data object */
    let data: any = {
      token: this.libConfigData.jwtToken,
      skip: this.page.start - 1,
      limit: this.page.page_count,
      timezone: this.filterOptions.timezone
    };
    this.httpRequest.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.viewEventSlots, data).subscribe((response) => {
      if (response.status == 'success') {
        this.libConfigData.responseData = response.data;
        this.loading = false;
      } else {
        this.openSnackBar('Something went wrong. Please try again.', null);
      }
    });
  }


  bookEvent() {
    const dialogRef = this.matDialog.open(BookEventComponent, {
      width: '500px',
      data: {
        libConfigData: this.libConfigData
      },
      panelClass: 'listing.component.css'
    });
  }

}
