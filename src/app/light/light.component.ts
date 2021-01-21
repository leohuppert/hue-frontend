import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Light} from '../shared/model/light.model';
import {HueService} from '../service/hue.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss']
})
export class LightComponent implements OnDestroy {

  @Input() light: Light | undefined;
  @Input() id: number | undefined;
  @Output() inputActive: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly ngUnsubscribe = new Subject();

  constructor(public hueService: HueService) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.complete();
  }

  get onStateText(): string {
    return this.light?.state.on ? 'Allumée' : 'Eteinte';
  }

  get toggleButtonText(): string {
    return this.light?.state.on ? 'Eteindre' : 'Allumer';
  }

  private refreshData(): void {
    this.hueService.getLightInfo(this.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(light => {
      this.light = light;
      this.inputActive.emit(false);
    });
  }

  onToggleLight(): void {
    this.onInput();
    this.hueService.toggleLight(this.id, !this.light?.state.on)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => this.refreshData());
  }

  onBrightnessChange(event: any): void {
    this.hueService.changeBrightness(this.id, event.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => this.refreshData());
  }

  onRandom(): void {
    this.onInput();
    this.hueService.setRandomHue(this.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => this.refreshData());
  }

  get r(): number {
    return this.hueService
      .xyBriToRgb(this.light?.state.xy[0] as number, this.light?.state.xy[1] as number, this.light?.state.bri as number).r;
  }

  get g(): number {
    return this.hueService
      .xyBriToRgb(this.light?.state.xy[0] as number, this.light?.state.xy[1] as number, this.light?.state.bri as number).g;
  }

  get b(): number {
    return this.hueService
      .xyBriToRgb(this.light?.state.xy[0] as number, this.light?.state.xy[1] as number, this.light?.state.bri as number).b;
  }

  get cardBackground(): string {
    return this.light?.state?.on
      ? `background-image: linear-gradient(180deg, rgb(${this.r}, ${this.g}, ${this.b}), #00000059 100%)`
      : 'background-color: grey;';
  }

  onInput(): void {
    this.inputActive.emit(true);
  }
}
