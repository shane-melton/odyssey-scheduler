import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { SharedModule } from '@client/shared/shared.module';

import {
  AdminContainerComponent,
  AdminLoginComponent,
  DashboardComponent,
  AdminSettingsComponent
} from '@client/features/admin/components';
import { NewBlockModalComponent } from './components/admin-settings/new-block-modal/new-block-modal.component';
import { ManageStudentsComponent } from './components/manage-students/manage-students.component';
import { AdminPrintComponent } from './components/admin-print/admin-print.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import { AdminCheckinComponent } from './components/admin-checkin/admin-checkin.component';
import { AdminEditStudentComponent } from '@client/features/admin/components/admin-edit-student/admin-edit-student.component';


const adminRoutes: Routes = [
  {
    path: 'admin', component: AdminContainerComponent,
    children: [
      {path: '', component: AdminLoginComponent, data: {hideNav: true}},
      {path: 'dash', component: DashboardComponent, data: {hideNav: false}},
      {path: 'settings', component: AdminSettingsComponent, data: {hideNav: false}},
      {path: 'students', component: ManageStudentsComponent, data: {hideNav: false}},
      {path: 'print', component: AdminPrintComponent, data: {hideNav: false}},
      {path: 'checkin', component: AdminCheckinComponent, data: {hideNav: false}},
      {path: 'students/:id/edit', component: AdminEditStudentComponent, data: {hideNav: false}},
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(adminRoutes)
  ],
  declarations: [
    AdminLoginComponent,
    AdminContainerComponent,
    DashboardComponent,
    AdminSettingsComponent,
    NewBlockModalComponent,
    ManageStudentsComponent,
    AdminPrintComponent,
    AdminCheckinComponent,
    AdminEditStudentComponent],
})
export class AdminModule {
}
