import { NgModule } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { HttpClientModule } from '@angular/common/http';

import {httpInterceptorProviders} from '@client/core/core.interceptors';
import { SchedulerService } from './scheduler/scheduler.service';
import { BlockService } from '@client/core/blocks/block.service';
import {StudentService} from '@client/core/student/student.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    httpInterceptorProviders,
    AuthService,
    BlockService,
    SchedulerService,
    StudentService
  ],
  exports: [
    HttpClientModule
  ]
})
export class CoreModule { }
