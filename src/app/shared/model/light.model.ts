export interface Light {
  state: {
    on: boolean;
    bri: number;
    hue: number;
    sat: number;
    xy: number[];
  };
  name: string;
  type: string;
}
