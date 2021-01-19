import {Light} from '../model/light.model';

export const LIGHTS_MOCK: Light[] = [
  {
    name: 'Lampe 1',
    type: 'LED',
    state: {
      on: true,
      bri: 178,
      hue: 1234,
      sat: 255,
      xy: [0.26, 35.22],
    }
  },
  {
    name: 'Lampe 3',
    type: 'LED',
    state: {
      on: true,
      bri: 178,
      hue: 12374,
      sat: 255,
      xy: [127.45, 35.22],
    }
  },
  {
    name: 'Lampe 3',
    type: 'LED',
    state: {
      on: false,
      bri: 254,
      hue: 12834,
      sat: 255,
      xy: [22.87, 6.22],
    }
  }
];
