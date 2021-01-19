import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Light} from '../shared/model/light.model';

@Injectable({
  providedIn: 'root'
})
export class HueService {

  constructor(private http: HttpClient) {}

  private readonly HUE_API = 'http://localhost:9000';

  private static getRandomHue(): number {
    return Math.floor(Math.random() * 65535) + 1;
  }

  getLights(): Observable<Light[]> {
    return this.http.get<Light[]>(`${this.HUE_API}/lights`);
  }

  toggleLight(id: number | undefined, on: boolean): Observable<any> {
    return this.http.put<any>(`${this.HUE_API}/lights/${id}/toggle`, { on });
  }

  getLightInfo(id: number | undefined): Observable<Light> {
    return this.http.get<Light>(`${this.HUE_API}/lights/${id}`);
  }

  changeBrightness(id: number | undefined, bri: number): Observable<any> {
    return this.http.put<any>(`${this.HUE_API}/lights/${id}/brightness`, { brightness: bri });
  }

  setRandomHue(id: number | undefined): Observable<any> {
    return this.http.put<any>(`${this.HUE_API}/lights/${id}/hue`, { hue: HueService.getRandomHue() });
  }

  xyBriToRgb(x: number, y: number, bri: number): any {
    const z = 1.0 - x - y;
    const Y = bri / 255.0; // Brightness of lamp
    const X = (Y / y) * x;
    const Z = (Y / y) * z;
    let r = X * 1.612 - Y * 0.203 - Z * 0.302;
    let g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    let b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    const maxValue = Math.max(r, g, b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;
    r = r * 255;   if (r < 0) { r = 255; }
    g = g * 255;   if (g < 0) { g = 255; }
    b = b * 255;   if (b < 0) { b = 255; }

    return {r, g, b};
  }
}
