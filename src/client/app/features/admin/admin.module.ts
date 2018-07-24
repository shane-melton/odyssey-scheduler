import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
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
import 'rxjs/add/observable/empty';
import { AdminCheckinComponent } from './components/admin-checkin/admin-checkin.component';
import { AdminViewStudentComponent } from '@client/features/admin/components/admin-view-student/admin-view-student.component';
import { EditStudentModalComponent } from './components/admin-view-student/edit-student-modal/edit-student-modal.component';
import { ScheduleMakeupModalComponent } from './components/admin-view-student/schedule-makeup-modal/schedule-makeup-modal.component';


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
      {path: 'students/:id/view', component: AdminViewStudentComponent, data: {hideNav: false}},
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
    AdminViewStudentComponent,
    EditStudentModalComponent,
    ScheduleMakeupModalComponent],
})
export class AdminModule {
}
