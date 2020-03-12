import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilitylistComponent } from './availabilitylist.component';

describe('AvailabilitylistComponent', () => {
  let component: AvailabilitylistComponent;
  let fixture: ComponentFixture<AvailabilitylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilitylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
