import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';
import { AuthguardService } from '../services/authguard.service';
import { from } from 'rxjs';
/* Resolve Service */
import { ResolveService } from '../services/resolve.service';

/* Auth Component */
import { LoginComponent } from '../components/auth/login/login.component';
import { ForgetpasswordComponent } from '../components/auth/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from '../components/auth/resetpassword/resetpassword.component';
import { LogoutComponent } from '../components/auth/logout/logout.component';
/****************** Admin *****************/
import { AdminDashboardComponent } from '../components/admin/admin-dashboard/admin-dashboard.component';

/* User Mnagement */
import { UserAddEditComponent } from '../components/admin/user-management/user-add-edit/user-add-edit.component'
import { AddEditComponent } from '../components/admin/admin-management/add-edit/add-edit.component';
import { ManageAdminListComponent } from '../components/admin/admin-management/manage-admin-list/manage-admin-list.component';
import { AddeditDoctorComponent } from '../components/admin/doctor-management/addedit-doctor/addedit-doctor.component';
import { ListDoctorComponent } from '../components/admin/doctor-management/list-doctor/list-doctor.component';

/* Biller Management */
import { AddEditBillerComponent } from '../components/admin/biller-management/add-edit-biller/add-edit-biller.component';
import { ListingBillerComponent } from '../components/admin/biller-management/listing-biller/listing-biller.component';

/* Tech Management */
import { AddEditTechComponent } from '../components/admin/tech-management/add-edit-tech/add-edit-tech.component';
import { ListingTechComponent } from '../components/admin/tech-management/listing-tech/listing-tech.component';
/**Doctor Office Mnagement**/
import { DoctorOfficeManagementComponent } from '../components/admin/doctor-office-management/doctor-office-management.component';
import { AddEditDoctorOfcComponent } from '../components/admin/doctor-office-management/add-edit-doctor-ofc/add-edit-doctor-ofc.component';
/**Booked-Appoiments**/
import { BookedAppoinmentsComponent } from '../components/admin/booked-appoinments/booked-appoinments.component';
/* Account Settings */
import { AccountSettingsComponent } from '../components/common/account-settings/account-settings.component';
import { ChangePasswordComponent } from '../components/common/account-settings/change-password/change-password.component';

/***************** Tech Dashboard ****************/
import { TechDashboardComponent } from '../components/tech/tech-dashboard/tech-dashboard.component';
import { ManageScheduleComponent } from '../components/tech/tech-dashboard/manage-calender/manage-schedule/manage-schedule.component';
import { ListComponent } from '../components/tech/tech-dashboard/manage-calender/my-appointments/list/list.component';

/* Patient Management */
import { AddEditPatientComponent } from '../components/tech/patient-management/add-edit-patient/add-edit-patient.component';

/* Bulk Upload**/
import { BulkUploadComponent } from '../components/tech/patient-management/bulk-upload/bulk-upload.component';

import { BillerDashboardComponent } from '../components/biller/biller-dashboard/biller-dashboard.component';
import { DoctorDashboardComponent } from '../components/doctor/doctor-dashboard/doctor-dashboard.component';
import { ReportDetailsComponent } from '../components/tech/report-details/report-details.component';

/***************** Doctor Office Dashboard ****************/
import { DoctorOfficeDashboardComponent } from '../components/doctor-office/doctor-office-dashboard/doctor-office-dashboard.component';

/* Error Pages */
import { NotFoundErrorComponent } from '../components/common/not-found-error/not-found-error.component';

/* Test Component */
import { TestComponent } from '../components/test/test.component';
import { HealthriskSystemEncounterComponent } from '../components/admin/tech-management/healthrisk-system-encounter/healthrisk-system-encounter.component';
import { SystemSuperbillComponent } from '../components/admin/tech-management/system-superbill/system-superbill.component';
import { HealthRiskAnalysisComponent } from '../components/admin/tech-management/health-risk-analysis/health-risk-analysis.component';
import { SignatureManagementComponent } from '../components/doctor/signature-management/signature-management.component';
import { DoctorOfficeAccountSettingsComponent } from '../components/doctor-office/doctor-office-account-settings/doctor-office-account-settings.component';

const routes: Routes = [
  /********** Auth Route **********/
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthguardService] },
  { path: 'forget-password', component: ForgetpasswordComponent, canActivate: [AuthguardService] },
  { path: 'reset-password/:token', component: ResetpasswordComponent },
  { path: 'sign-up', redirectTo: '/login', pathMatch: 'full' },
  { path : 'logout' , component : LogoutComponent },

  /****************** Admin *****************/
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthguardService],
   resolve: { dataCount: ResolveService },
    data: {
      requestcondition: {
        source: 'Patient-Record-Report_view',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  /* Account-Settings */
  { path: 'admin/account-settings', component: AccountSettingsComponent, canActivate: [AuthguardService] },
  { path: 'admin/account-settings/change-password', component: ChangePasswordComponent, canActivate: [AuthguardService] },
  /* User Management */
  { path: 'admin/user-management/add', component: UserAddEditComponent, canActivate: [AuthguardService] },
  {
    path: 'admin/user-management/edit/:_id', component: UserAddEditComponent, canActivate: [AuthguardService], resolve: { UserData: ResolveService },
    data: {
      requestcondition: {
        source: 'user_management',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  /* Admin Management */
  { path: 'admin/admin-management/add', component: AddEditComponent, canActivate: [AuthguardService] },
  {
    path: 'admin/admin-management/edit/:_id', component: AddEditComponent, canActivate: [AuthguardService], resolve: { adminsingleData: ResolveService },
    data: {
      requestcondition: {
        source: 'users',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  {
    path: 'admin/admin-management', component: ManageAdminListComponent, canActivate: [AuthguardService], resolve: { adminManagementdData: ResolveService },
    data: {
      requestcondition: {
        source: 'users_view_admin',
        condition: { 'type': 'admin' }
      },
      endpoint: 'datalist'
    },
  },
  /* Biller Management */
  { path: 'admin/biller-management/add', component: AddEditBillerComponent, canActivate: [AuthguardService] },
  {
    path: 'admin/biller-management/edit/:_id', component: AddEditBillerComponent, canActivate: [AuthguardService], resolve: { billersingleData: ResolveService },
    data: {
      requestcondition: {
        source: 'users',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  {
    path: 'admin/biller-management', component: ListingBillerComponent, canActivate: [AuthguardService], resolve: { Billerdata: ResolveService },
    data: {
      requestcondition: {
        source: 'users_view_biller',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  /* Tech Management */
  { path: 'admin/tech-management/add', component: AddEditTechComponent, canActivate: [AuthguardService] },
  {
    path: 'admin/tech-management/edit/:_id', component: AddEditTechComponent, canActivate: [AuthguardService], resolve: { techData: ResolveService },
    data: {
      requestcondition: {
        source: 'users',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  {
    path: 'admin/tech-management', component: ListingTechComponent, canActivate: [AuthguardService], resolve: { techDashboardData: ResolveService },
    data: {
      requestcondition: {
        source: 'users_view_tech',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  /* Doctor Management */
  { path: 'admin/doctor-management/add', component: AddeditDoctorComponent },
  {
    path: 'admin/doctor-management/edit/:_id', component: AddeditDoctorComponent, canActivate: [AuthguardService],
    resolve: { data: ResolveService },
    data: {
      requestcondition: {
        source: 'users',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  {
    path: 'admin/doctor-management', component: ListDoctorComponent, canActivate: [AuthguardService],
    resolve: { data: ResolveService },
    data: {
      requestcondition: {
        source: 'users_view_doctor',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  /* Doctor Office Management */
  {
    path: 'admin/doctor-office-management', component: DoctorOfficeManagementComponent, canActivate: [AuthguardService],
    resolve: { data: ResolveService },
    data: {
      requestcondition: {
        source: 'users_view_doctoroffice',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  { path :'admin/doctor-office-management/add' ,component : AddEditDoctorOfcComponent,canActivate : [AuthguardService] },
  {
    path: 'admin/doctor-office-management/edit/:_id', component: AddEditDoctorOfcComponent, canActivate: [AuthguardService],
    resolve: { data: ResolveService },
    data: {
      requestcondition: {
        source: 'users',
        condition: {}
      },
      endpoint: 'datalist'
    },    
  },
  /* Docotr Management Account settings*/
  {
    path: 'doctor-office/account-settings', component: DoctorOfficeAccountSettingsComponent, canActivate: [AuthguardService],
    resolve: { data: ResolveService },
    data: {
      requestcondition: {
        source: 'users',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },
  /****************** Tech Route End *****************/
  /**Booked-appoinments**/
  {
    path : 'admin/booked-appoinments' , component : BookedAppoinmentsComponent
  },

  /****************** Tech Route Start *****************/
  { path: 'tech/dashboard', component: TechDashboardComponent, canActivate: [AuthguardService],
    resolve: { techDashboardData: ResolveService },
    data: {
      requestcondition: {
        source: 'Patient-Record-Report_view',
        condition: {},
      },
      endpoint: 'datalist'
    },
  },
  { path: 'tech/report/total-uploaded', component: ReportDetailsComponent, canActivate: [AuthguardService],},
  { path: 'tech/report/total-processed', component: ReportDetailsComponent, canActivate: [AuthguardService],},
  { path: 'tech/report/total-remained-processed', component: ReportDetailsComponent, canActivate: [AuthguardService],},
  { path : 'tech/dashboard/manage-calender/manage-sehedule' , component : ManageScheduleComponent , canActivate: [AuthguardService]},
  { path : 'tech/dashboard/manage-calender/my-appoinments' , component : ListComponent , canActivate: [AuthguardService]},
  
  /* Account-Settings */
  { path: 'tech/account-settings', component: AccountSettingsComponent, canActivate: [AuthguardService] },
  { path: 'tech/account-settings/change-password', component: ChangePasswordComponent, canActivate: [AuthguardService] },
  { path: 'tech/patient-management/add', component: AddEditPatientComponent, canActivate: [AuthguardService] },
  
  /* Bulk Upload */
  { path: 'tech/patient-management/bulk-upload', component: BulkUploadComponent, canActivate: [AuthguardService] },
  
  { path: 'tech/health-risk-system-encounter', component: HealthriskSystemEncounterComponent},
  { path: 'tech/system-superbill', component: SystemSuperbillComponent},
  { path: 'tech/health-risk-analysis', component: HealthRiskAnalysisComponent},
  /****************** Tech Route End *****************/

  /* Biller Route */
  // { path: 'biller/dashboard', component: BillerDashboardComponent, canActivate: [AuthguardService] },
  {
    path: 'biller/dashboard', component: BillerDashboardComponent, canActivate: [AuthguardService],
    resolve: { billerData: ResolveService },
    data: {
      requestcondition: {
        source: 'Patient-Record-Report_view',
        condition: {},
      },
      endpoint: 'datalist'
    },
  },
  /* Account-Settings */
  { path: 'biller/account-settings', component: AccountSettingsComponent, canActivate: [AuthguardService] },
  { path: 'biller/account-settings/change-password', component: ChangePasswordComponent, canActivate: [AuthguardService] },

  /* Doctor Route */
  { path: 'doctor/dashboard', component: DoctorDashboardComponent, canActivate: [AuthguardService] },
  { path: 'doctor/signature-management', component: SignatureManagementComponent, canActivate: [AuthguardService] },

  /* Account-Settings */
  { path: 'doctor/account-settings', component: AccountSettingsComponent, canActivate: [AuthguardService] },
  { path: 'doctor/account-settings/change-password', component: ChangePasswordComponent, canActivate: [AuthguardService] },
  /****************** Doctor Route End *****************/

  /****************** Doctor Office Route Start *****************/
  { path: 'doctor-office/dashboard', component: DoctorOfficeDashboardComponent, canActivate: [AuthguardService] },
  /* Account-Settings */
  { path: 'doctor-office/account-settings', component: AccountSettingsComponent, canActivate: [AuthguardService] },
  { path: 'doctor-office/account-settings/change-password', component: ChangePasswordComponent, canActivate: [AuthguardService] },
  /****************** Doctor Office Route End *****************/

  /* test component route start here */
  { path: 'test', component: TestComponent,
    resolve: { dataCount: ResolveService },
    data: {
      requestcondition: {
        source: 'Patient-Record-Report_view',
        condition: {}
      },
      endpoint: 'datalist'
    },
  },

  { path: 'tech/health-risk-system-encounter', component: HealthriskSystemEncounterComponent },
  { path: 'tech/system-superbill', component: SystemSuperbillComponent },
  { path: 'tech/health-risk-analysis', component: HealthRiskAnalysisComponent },

  /* Error Page Route */
  { path: 'error/404', component: NotFoundErrorComponent },
  { path: '**', component: NotFoundErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ResolveService]
})

export class AppRoutingModule {



  constructor() {}

}
