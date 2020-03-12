import {NgModule} from '@angular/core';
import {CalendarManagementComponent} from './calendar-management.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DemoMaterialModule} from './modules/materialModule';
import {HttpClientModule} from '@angular/common/http';
import {ListingModule} from 'listing-angular7';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import {MaterialTimePickerModule} from '@candidosales/material-time-picker';

/* Create Slot */
import {CreateSlotComponent} from './components/create-slot/create-slot.component';
import {ViewSlotComponent} from './components/view-slot/view-slot.component';
import {SyncWithGoogleComponent} from './components/sync-with-google/sync-with-google.component';
import {ListingComponent, ConfirmDialogBoxComponent, EditEventComponent} from './components/listing/listing.component';
import {AvailabilitylistComponent} from './availabilitylist/availabilitylist.component';
import {LoginComponent} from './login/login.component';
import {ApiService} from './../lib/services/api.service';
import {from} from 'rxjs';
import {LoginForCalendarComponent} from './components/login-for-calendar/login-for-calendar.component';
import {BookEventComponent, ViewSlotUserComponent} from './components/view-slot-user/view-slot-user.component';

@NgModule({
  declarations: [
    CalendarManagementComponent,
    CreateSlotComponent,
    ViewSlotComponent,
    BookEventComponent,
    SyncWithGoogleComponent,
    ListingComponent,
    ConfirmDialogBoxComponent,
    EditEventComponent,
    AvailabilitylistComponent,
    LoginComponent,
    LoginForCalendarComponent,
    ViewSlotUserComponent
  ],
  imports: [
    DemoMaterialModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ListingModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MaterialTimePickerModule
  ],
  exports: [
    CalendarManagementComponent,
    CreateSlotComponent,
    ViewSlotComponent,
    BookEventComponent,
    SyncWithGoogleComponent,
    ListingComponent,
    ConfirmDialogBoxComponent,
    AvailabilitylistComponent,
    LoginComponent,
    LoginForCalendarComponent,
    ViewSlotUserComponent
  ],
  providers: [ApiService],
  entryComponents: [CreateSlotComponent, ConfirmDialogBoxComponent, EditEventComponent, BookEventComponent]
})
export class CalendarManagementModule {
}
