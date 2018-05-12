import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '@client/core/core.module';
import { SharedModule } from '@client/shared/shared.module';

import {
  MissedSelectorComponent,
  StudentLoginComponent,
  SchedulerContainerComponent,
  MakeupSelectorComponent,
  ConfirmSelectionComponent
} from '@client/features/scheduler/components';


const schedulerRoutes: Routes = [
  {
    path: '', component: SchedulerContainerComponent,
    children: [
      {path: '', component: StudentLoginComponent},
      {path: 'missed', component: MissedSelectorComponent},
      {path: 'makeup', component: MakeupSelectorComponent},
      {path: 'confirm', component: ConfirmSelectionComponent},
    ]
  }
];

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    RouterModule.forChild(schedulerRoutes),
  ],
  declarations: [
    SchedulerContainerComponent,
    MissedSelectorComponent,
    StudentLoginComponent,
    MakeupSelectorComponent,
    ConfirmSelectionComponent
  ]
})
export class SchedulerModule {
}
