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


@Injectable()
export class PdfResolver implements Resolve<null> {
  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<null> {
    const url = route.queryParamMap.get('url');
    console.log(url);
    this.router.navigateByUrl(url);
    return Observable.empty();
  }
}



const adminRoutes: Routes = [
  {
    path: 'admin', component: AdminContainerComponent,
    children: [
      {path: '', component: AdminLoginComponent, data: {hideNav: true}},
      {path: 'dash', component: DashboardComponent, data: {hideNav: false}},
      {path: 'settings', component: AdminSettingsComponent, data: {hideNav: false}},
      {path: 'students', component: ManageStudentsComponent, data: {hideNav: false}},
      {path: 'print', component: AdminPrintComponent, data: {hideNav: false}},
      {path: 'printer', component: AdminPrintComponent, data: {hideNav: false}, resolve: {download: PdfResolver}},
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
    AdminPrintComponent],
  providers: [
    PdfResolver
  ]
})
export class AdminModule {
}
