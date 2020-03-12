import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'lib-login-for-calendar',
  templateUrl: './login-for-calendar.component.html',
  styleUrls: ['./login-for-calendar.component.css']
})
export class LoginForCalendarComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(public fb: FormBuilder, public cookieService: CookieService,
              public apiService: ApiService, public router: Router) {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)])],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  inputUntouched(val: any) {
    this.loginForm.controls[val].markAsUntouched();
  }

  loginFormSubmit() {
    for (let i in this.loginForm.controls) {
      this.loginForm.controls[i].markAllAsTouched();
    }
    let link = 'https://m9mkuic6o9.execute-api.us-east-1.amazonaws.com/dev/api/login';
    let data: any = this.loginForm.value;
    this.apiService.postlogin(link, data).subscribe(Response => {
      let result: any = Response;
      console.log('response', result);
      if (result.status == 'success') {
        this.cookieService.set('user_details', JSON.stringify(result.item[0]));
        this.cookieService.set('jwtToken', result.token);
        this.router.navigateByUrl('/calendar-management');
      }
    });

  }
}
