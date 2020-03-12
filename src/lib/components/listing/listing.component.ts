import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { HttpRequestService } from '../../services/http-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import moment from 'moment-es6';

export interface TableInterface {
  position: number;
  title: string;
  description: string;
  schedule: string;
  eventType: string;
  status: string;
  username: string;
}

const ELEMENT_DATA: TableInterface[] = [];

@Component({
  selector: 'lib-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})

export class ListingComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title', 'description', 'schedule', 'event_type', 'status', 'username', 'action'];
  dataSource = new MatTableDataSource<TableInterface>(ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public libConfigData: any;
  public tableData: any;
  public loading = false;
  /* Search fields */
  public filterOptions: any = {
    eventTitle: '',
    avilableDates: '',
    days: [],
    status: ''
  };
  days = new FormControl();
  dayList: String[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'];

  eventType = new FormControl();

  /* Get data from input */
  @Input()
  set configData(configData: any) {
    this.libConfigData = configData;
    this.tableData = this.libConfigData.responseData;
  }

  constructor(public http: HttpClient, private httpRequest: HttpRequestService,
              private router: Router, public activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar, public matDialog: MatDialog) {

  }

  ngOnInit() {
    console.log('this.libConfigData', this.libConfigData);
    this.onPopulate();
  }

  onPopulate() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
    console.log('data', this.tableData);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onKeyDown(event) {
    if (event.code == 'Enter') {
      this.search();
    }
  }

  search() {
    const data: any = {
      condition: {},
      token: this.libConfigData.jwtToken
    };
    if (this.filterOptions.avilableDates != '') {
      data.condition.start_date = {
        $gte: moment(this.filterOptions.avilableDates.begin).format()
      };

      data.condition.end_date = {
        $lte: moment(this.filterOptions.avilableDates.end).format()
      };
    }
    if (this.filterOptions.eventTitle != '') {
      data.condition.event_title_search = { $regex: this.filterOptions.eventTitle.toLowerCase() };
      console.log('data.condition.event_title', data.condition.event_title );
    }

    if (this.eventType.value != null) {
      data.condition.event_type = this.eventType.value;
    }

    const dayconditionarr: any = [];
    if (this.days.value != null) {
      this.days.value.forEach(element => {
        switch (element) {
          case 'Sunday':
            dayconditionarr.push({ sun: true });
            break;
          case 'Monday':
            dayconditionarr.push({ mon: true });
            break;
          case 'Tuesday':
            dayconditionarr.push({ tues: true });
            break;
          case 'Wednesday':
            dayconditionarr.push({ wed: true });
            break;
          case 'Thursday':
            dayconditionarr.push({ thurs: true });
            break;
          case 'Friday':
            dayconditionarr.push({ fri: true });
            break;
          case 'Saturday':
            dayconditionarr.push({ sat: true });
            break;
        }
      });
    }
    console.log('has dayarr', dayconditionarr);
    if (Object.keys(dayconditionarr).length > 0) {
      console.log('has dayarr');

      const ts = Object.keys(dayconditionarr).map(function(key) {
        return [(key.toString()), dayconditionarr[key]];
      });
      data.dayscond = dayconditionarr;
      // data.condition.push({$or:[dayconditionarr]});
    }
    console.log('data', data);

    this.loading = true;
    this.httpRequest.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.search, data).subscribe((response) => {
      if (response.data.length == 0) {
        this.openSnackBar('No event found', null);
      } else {
        this.openSnackBar(response.data.length + ' event(s) found', null);
        this.tableData = response.data;
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
      }
      this.loading = false;
    });
  }

  resetFilter() {
    this.filterOptions.avilableDates = '';
    this.filterOptions.eventTitle = '';
    this.days = new FormControl();
    this.eventType = new FormControl();
    this.tableData = this.libConfigData.responseData;
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
  }

  editEvent(element) {
    const dialogRef = this.matDialog.open(EditEventComponent, {
      width: '500px',
      data: {
        element,
        libConfigData: this.libConfigData
      },
      panelClass: 'listing.component.css'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.httpRequest.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.datalist, { token: this.libConfigData.jwtToken }).subscribe((response) => {
        this.tableData = response.data;
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  deleteEvent(elementID, index) {
    const data: any = {
      data: {
        id: elementID,
      },
      token: this.libConfigData.jwtToken
    };

    const dialogRef = this.matDialog.open(ConfirmDialogBoxComponent, {
      width: '250px',
      data: { type: 'Caution!', message: 'Are you sure delete this event?', button_true: 'Yes', button_false: 'No' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.loading = true;
        this.httpRequest.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.deleteEvent, data).subscribe((response) => {
          console.log('response', response);
          if (response.status == 'success') {
            this.openSnackBar('Event deleted successfully', null);
            this.libConfigData.responseData.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.libConfigData.responseData);
            this.dataSource.paginator = this.paginator;
          } else {
            this.openSnackBar('Something went wrong! Data cannot be deleted', null);
          }
          this.loading = false;
        });
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  redirect(flag: String) {
    if (flag == 'create') {
      this.router.navigateByUrl(this.libConfigData.urls.createEvent);
    }
  }

}

/* Modal for cofirmation of delete */
export interface DialogData {
  type: string;
  message: string;
  button_true: string;
  button_false: string;
}
@Component({
  selector: 'app-confirm-dialog-box',
  templateUrl: './confirm-dialog-box.html'
})

export class ConfirmDialogBoxComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    // console.log(this.data);
  }

  clickFalse() {
    this.dialogRef.close(false);
  }

  clickTrue() {
    this.dialogRef.close(true);
  }

}

export let updateData: any = '';

/* Modal for editing event data */
@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.html'
})

export class EditEventComponent implements OnInit {
  public addAvailabilityForm: FormGroup;
  public dateRange: any = {};
  public slotTimeStart: any = { hour: 10, minute: 0, meriden: 'AM', format: 24 };
  public slotTimeEnd: any = { hour: 18, minute: 0, meriden: 'PM', format: 24 };

  /* Error Flag */
  public errors: any = { dateRange: false, weekdaysError: false, slotTimeStart: false, slotTimeEnd: false };

  constructor(
    public dialogRef: MatDialogRef<EditEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, public http: HttpClient,
    private httpService: HttpRequestService, private router: Router,
    private snackBar: MatSnackBar,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    console.log('this.data.element', this.data.element);
    this.generateForm();
  }

  clickFalse() {
    this.dialogRef.close(false);
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  onChangeHourS(event) {
    console.log('event', event);
    //this.slotTimeStart=event;
    this.addAvailabilityForm.controls['start_time'].patchValue(event.hour + ':' + event.minute);
    console.log('start', this.addAvailabilityForm.controls['start_time'].value);
  }

  onChangeHourE(event) {
    console.log('event', event);
    //this.slotTimeEnd=event;
    this.addAvailabilityForm.controls['end_time'].patchValue(event.hour + ':' + event.minute);
    console.log('end', this.addAvailabilityForm.controls['end_time'].value);
  }

  generateForm() {
    this.dateRange.begin = moment(this.data.element.start_date).format();
    this.dateRange.end = moment(this.data.element.end_date).format();

    this.addAvailabilityForm = this.formBuilder.group({
      id: [this.data.element._id],
      event_title: [this.data.element.event_title, [Validators.required, Validators.maxLength(150)]],
      description: [this.data.element.description, [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]],
      event_type: [this.data.element.event_type, [Validators.required]],
      start_date: [this.data.element.start_date],
      end_date: [this.data.element.end_date],
      start_time: [this.data.element.start_time],
      end_time: [this.data.element.end_time],
      sun: [this.data.element.sun],
      mon: [this.data.element.mon],
      tues: [this.data.element.tues],
      wed: [this.data.element.wed],
      thurs: [this.data.element.thurs],
      fri: [this.data.element.fri],
      sat: [this.data.element.sat],
      timespan: [this.data.element.timespan, [Validators.required]],
      timezone: [this.data.element.timezone, [Validators.required]],
      // is_custom: [ false, "" ],
      // is_discovery: [ false, "" ],
      // is_onboarding: [ false, "" ],
      // is_qna: [ false, "" ],
      // meetingwith: [ false, "" ],
      // userid: [ false, "" ],
      status: [1],
      created_by: ['5d429eb2ba5a7f4f357b5563']
    });

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  formSubmit() {
    console.log('date range', this.dateRange.begin);
    /* Available Dates */
    if (Object.entries(this.dateRange).length > 0) {
      let startDate = moment(this.dateRange.begin).add(1, 'days');
      let endDate = moment(this.dateRange.end).add(1, 'days');
      this.addAvailabilityForm.controls.start_date.setValue(startDate);
      this.addAvailabilityForm.controls.end_date.setValue(endDate);
      this.errors.avilableDates = false;
    } else {
      this.errors.avilableDates = true;
    }

    /* Weekday validation */
    if (!this.addAvailabilityForm.controls.sun.value && !this.addAvailabilityForm.controls.mon.value && !this.addAvailabilityForm.controls.tues.value && !this.addAvailabilityForm.controls.wed.value && !this.addAvailabilityForm.controls.thurs.value && !this.addAvailabilityForm.controls.fri.value && !this.addAvailabilityForm.controls.sat.value) {
      this.errors.weekdaysError = true;
    } else {
      this.errors.weekdaysError = false;
    }

    if (this.addAvailabilityForm.valid) {
      const data: any = {
        source: 'events',
        data: this.addAvailabilityForm.value,
        sourceobj: [
          'userid'
        ],
        token: this.data.libConfigData.jwtToken
      };

      this.httpService.httpViaPost(this.data.libConfigData.baseUrl + this.data.libConfigData.endPoint.add, data).subscribe((response) => {
        console.log('Server response >>-->', response);
        // if (response.status == 'success') {
        //
        //   this.openSnackBar('Data updated successfully', null);
        //   this.data.element = data.data;
        //
        //   updateData = data.data;
        //   console.log('updateData', updateData);
        //   this.clickTrue();
        // }
        if (response.result.ok == 1) {
          this.openSnackBar('1 event added. ' + response.result.n + ' day created', null);
          this.data.element = data.data;
          updateData = data.data;
          this.closeDialog();
        } else {
          this.openSnackBar(response.result.msg, null);
        }
      });
    } else {
      console.log('Error >>-->', this.addAvailabilityForm);
    }
  }
}
