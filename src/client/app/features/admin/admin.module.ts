import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminContainerComponent } from './components/admin-container/admin-container.component';

const adminRoutes: Routes = [
  {
    path: 'admin', component: AdminContainerComponent,
    children: [
      { path: '', component: AdminLoginComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes)
  ],
  declarations: [AdminLoginComponent, AdminContainerComponent]
})
export class AdminModule { }
