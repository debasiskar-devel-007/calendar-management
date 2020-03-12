import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSlotUserComponent } from './view-slot-user.component';

describe('ViewSlotUserComponent', () => {
  let component: ViewSlotUserComponent;
  let fixture: ComponentFixture<ViewSlotUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSlotUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSlotUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
