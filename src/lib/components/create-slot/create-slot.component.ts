import {Component, OnInit, Input, ViewChild, Inject} from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpRequestService} from '../../services/http-request.service';
import {CookieService} from 'ngx-cookie-service';
import {MatSnackBar} from '@angular/material';
import moment from 'moment-es6';

@Component({
  selector: 'lib-create-slot',
  templateUrl: './create-slot.component.html',
  styleUrls: ['./create-slot.component.css']
})

export class CreateSlotComponent implements OnInit {

  public libConfigData: any = {};

  /* Get data from input */
  @Input()
  set configData(configData: any) {
    this.libConfigData = configData;
    console.log(this.libConfigData);
  }

  public addAvailabilityForm: FormGroup;
  public availableDates: any = {};
  public slotTimeStart: any = {hour: 10, minute: 0, meriden: 'AM', format: 24};
  public slotTimeEnd: any = {hour: 18, minute: 0, meriden: 'PM', format: 24};

  public userid: any;
  public username: any;
  /* Error Flag */
  public errors: any = {availableDates: false, weekdaysError: false, slotTimeStart: false, slotTimeEnd: false};

  constructor(public formBuilder: FormBuilder, public httpService: HttpRequestService, public snackBar: MatSnackBar,
              public activeRoute: ActivatedRoute, public router: Router, public cookieService: CookieService) {

  }

  ngOnInit() {
    if (this.cookieService.check('user_details')) {
      let cookieData: any = JSON.parse(this.cookieService.get('user_details'));

      this.userid = cookieData._id;
      this.username = cookieData.firstname + ' ' + cookieData.lastname;

      this.generateForm();
    } else {
      this.router.navigateByUrl(this.libConfigData.urls.login);
    }
  }

  generateForm() {
    this.addAvailabilityForm = this.formBuilder.group({
      event_title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]],
      event_type: ['', [Validators.required]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      start_time: ['', ''],
      end_time: ['', ''],
      sun: [false],
      mon: [false],
      tues: [false],
      wed: [false],
      thurs: [false],
      fri: [false],
      sat: [false],
      timespan: ['', [Validators.required]],
      timezone: ['', [Validators.required]],
      is_custom: [false, ''],
      is_discovery: [false, ''],
      is_onboarding: [false, ''],
      is_qna: [false, ''],
      meetingwith: [false, ''],
      userid: [this.userid],
      username: [this.username],
      status: [1],
      created_by: ['5d429eb2ba5a7f4f357b5563']
    });
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

  onBlur() {
    console.log('avilableDates', this.availableDates);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  formSubmit() {
    /* Available Dates */
    if (Object.entries(this.availableDates).length > 0) {
      let startDate = moment(this.availableDates.begin).add(1, 'days');
      let endDate = moment(this.availableDates.end).add(1, 'days');
      this.addAvailabilityForm.controls['start_date'].setValue(startDate);
      this.addAvailabilityForm.controls['end_date'].setValue(endDate);
      this.errors.avilableDates = false;
    } else {
      this.errors.avilableDates = true;
    }

    /* Weekday validation */
    if (!this.addAvailabilityForm.controls['sun'].value && !this.addAvailabilityForm.controls['mon'].value && !this.addAvailabilityForm.controls['tues'].value && !this.addAvailabilityForm.controls['wed'].value && !this.addAvailabilityForm.controls['thurs'].value && !this.addAvailabilityForm.controls['fri'].value && !this.addAvailabilityForm.controls['sat'].value) {
      this.errors.weekdaysError = true;
    } else {
      this.errors.weekdaysError = false;
    }

    /* Creating moment object for start time and end time */
    let start = moment(this.addAvailabilityForm.controls['start_time'].value, ["HH:mm"]);
    let end = moment(this.addAvailabilityForm.controls['end_time'].value, ["HH:mm"]);
    /* Calculating time difference */
    let timeDifference = moment.duration(end.diff(start)).asMinutes();
    let slotTime = this.addAvailabilityForm.controls['timespan'].value;
    /* Checking timespan meets the expected endtime or not */
    if (timeDifference % slotTime != 0) {
      this.errors.slotTimeStart = true;
      this.errors.slotTimeEnd = true;
      this.openSnackBar("Invalid time slot. " +
        "Suggestion: Add or subtract " + timeDifference % slotTime + " min with Start or End time.", null);
    }
    else {
      this.errors.slotTimeStart = false;
      this.errors.slotTimeEnd = false;

      if (this.addAvailabilityForm.valid) {
        let data: any = {
          source: 'events',
          data: this.addAvailabilityForm.value,
          sourceobj: [
            'userid'
          ],
          token: this.libConfigData.jwtToken
        };

        this.httpService.httpViaPost(this.libConfigData.baseUrl + this.libConfigData.endPoint.add, data).subscribe((response) => {
          console.log('Server response >>-->', response);
          if (response.result.ok == 1) {
            this.openSnackBar('1 event added. ' + response.result.n + ' day created', null);
          } else {
            this.openSnackBar(response.result.msg, null);
          }
        });
        console.log('data', data);
      } else {
        console.log('Error >>-->', this.addAvailabilityForm);
      }
    }
  }

  redirect(flug: string) {
    switch (flug) {
      case 'view':
        this.router.navigateByUrl(this.libConfigData.urls.view);
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
