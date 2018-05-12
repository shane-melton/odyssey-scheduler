import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SchedulerRouterTransitions } from '@client/features/scheduler/animations/scheduler-router.transitions';

@Component({
  selector: 'app-scheduler-container',
  templateUrl: './scheduler-container.component.html',
  styleUrls: ['./scheduler-container.component.scss'],
  animations: [SchedulerRouterTransitions()]
})
export class SchedulerContainerComponent {

  constructor() { }

  getRouteAnimation(outlet: RouterOutlet) {
    return outlet.activatedRouteData.state;
  }
}
