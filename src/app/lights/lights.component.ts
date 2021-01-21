import {Component, OnDestroy, OnInit} from '@angular/core';
import {HueService} from '../service/hue.service';
import {Light} from '../shared/model/light.model';
import {interval, NEVER, Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss']
})
export class LightsComponent implements OnInit, OnDestroy {

  lights: Light[] = [];
  makeRequest = true;
  lightsSubscription: Subscription | undefined;
  private readonly REQUEST_INTERVAL = 2000;

  constructor(private hueService: HueService) {}

  ngOnInit(): void {
    this.hueService.getLights().toPromise().then(data => this.lights = data);

    this.lightsSubscription = interval(this.REQUEST_INTERVAL)
      .pipe(
        switchMap(() => this.makeRequest ? this.hueService.getLights() : NEVER)
      )
      .subscribe(data => this.lights = data);
  }

  ngOnDestroy(): void {
    if (this.lightsSubscription) {
      this.lightsSubscription.unsubscribe();
    }
  }

  onMakeRequestChange(event: boolean): void {
    this.makeRequest = !event;
  }

}
