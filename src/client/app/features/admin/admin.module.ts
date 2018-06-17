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

const adminRoutes: Routes = [
  {
    path: 'admin', component: AdminContainerComponent,
    children: [
      {path: '', component: AdminLoginComponent, data: {hideNav: true}},
      {path: 'dash', component: DashboardComponent, data: {hideNav: false}},
      {path: 'settings', component: AdminSettingsComponent, data: {hideNav: false}},
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(adminRoutes)
  ],
  declarations: [AdminLoginComponent, AdminContainerComponent, DashboardComponent, AdminSettingsComponent, NewBlockModalComponent]
})
export class AdminModule {
}
