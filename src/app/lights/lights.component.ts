import {Component, OnInit} from '@angular/core';
import {HueService} from '../service/hue.service';
import {Light} from '../shared/model/light.model';
import {BehaviorSubject, interval, NEVER} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss']
})
export class LightsComponent implements OnInit {

  lights: Light[] = [];
  lights$: BehaviorSubject<Light[]> = new BehaviorSubject<Light[]>([]);
  makeRequest = true;

  constructor(private hueService: HueService) {}

  ngOnInit(): void {
    interval(2000)
      .pipe(
        switchMap(() => this.makeRequest ? this.hueService.getLights() : NEVER)
      )
      .subscribe(data => {
        if (this.lights !== data) {
          this.lights = data;
        }

        this.lights$.next(data);
      });
  }

  onMakeRequestChange(event: boolean): void {
    console.log('make request change input = ', event);
    this.makeRequest = !event;
  }

}
