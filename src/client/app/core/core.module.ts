import { NgModule } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { HttpClientModule } from '@angular/common/http';

import {httpInterceptorProviders} from '@client/core/core.interceptors';
import { SchedulerService } from './scheduler/scheduler.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    httpInterceptorProviders,
    AuthService,
    SchedulerService
  ],
  exports: [
    HttpClientModule
  ]
})
export class CoreModule { }
