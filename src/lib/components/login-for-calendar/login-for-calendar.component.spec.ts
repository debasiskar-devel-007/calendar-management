import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginForCalendarComponent } from './login-for-calendar.component';

describe('LoginForCalendarComponent', () => {
  let component: LoginForCalendarComponent;
  let fixture: ComponentFixture<LoginForCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginForCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginForCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
