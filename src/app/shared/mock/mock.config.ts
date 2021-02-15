import { of } from 'rxjs';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { LIGHTS_MOCK } from './light.mock';


const extractIdPathParamFromUrl = (request: HttpRequest<any>) => {
    const requestUrl = new URL(request.url);
    console.log(requestUrl.pathname.split('/')[2])
    // TODO : Un meilleur moyen de récupérer l'id ?
    return +requestUrl.pathname.split('/')[2];
};

const getLights = (request: HttpRequest<any>) => {
    return of(new HttpResponse({
        status: 200, body: LIGHTS_MOCK
    }));
};

const getLightInfo = (request: HttpRequest<any>) => {
    const id = extractIdPathParamFromUrl(request);
    const light = LIGHTS_MOCK.find(l => l.id === id);
    return of(new HttpResponse({
        status: 200, body: light
    }));
};

// TODO : code dupliqué
const toggleLight = (request: HttpRequest<any>) => {
    const id = extractIdPathParamFromUrl(request);
    const lightIndex = LIGHTS_MOCK.findIndex(c => c.id === id);
    const light = request.body;
    LIGHTS_MOCK[lightIndex] = { ...LIGHTS_MOCK[lightIndex], state: { ...LIGHTS_MOCK[lightIndex].state, ...light } };
    return of(new HttpResponse({
        status: 200, body: LIGHTS_MOCK[lightIndex]
    }));
};

// TODO : code dupliqué
const changeBrightness = (request: HttpRequest<any>) => {
    const id = extractIdPathParamFromUrl(request);
    const lightIndex = LIGHTS_MOCK.findIndex(c => c.id === id);
    const { brightness: bri } = request.body;
    const light = { bri }
    LIGHTS_MOCK[lightIndex] = { ...LIGHTS_MOCK[lightIndex], state: { ...LIGHTS_MOCK[lightIndex].state, ...light } };
    return of(new HttpResponse({
        status: 200, body: LIGHTS_MOCK[lightIndex]
    }));
};
// TODO : code dupliqué
const setRandomHue = (request: HttpRequest<any>) => {
    const id = extractIdPathParamFromUrl(request);
    const lightIndex = LIGHTS_MOCK.findIndex(c => c.id === id);
    console.log(request.body)
    console.log(LIGHTS_MOCK[lightIndex])
    const light = request.body;
    LIGHTS_MOCK[lightIndex] = { ...LIGHTS_MOCK[lightIndex], state: { ...LIGHTS_MOCK[lightIndex].state, ...light } };
    console.log(LIGHTS_MOCK[lightIndex])
    return of(new HttpResponse({
        status: 200, body: LIGHTS_MOCK[lightIndex]
    }));
};

export const selectHandler = (request: HttpRequest<any>) => {
    const requestUrl = new URL(request.url);
    const getOneRegexp: RegExp = new RegExp(`/lights/[0-9a-zA-Z]+`);
    const pathname = requestUrl.pathname;
    switch (request.method) {
        case 'GET':
            if (pathname === '/lights') {
                return getLights;
            } else if (getOneRegexp.test(pathname)) {
                return getLightInfo;
            } else {
                return null;
            }
        case 'POST':
            return null;
        case 'PUT':
            if (pathname.includes('/toggle')) {
                return toggleLight;
            } else if (pathname.includes('/brightness')) {
                return changeBrightness;
            } else if (pathname.includes('/hue')) {
                return setRandomHue;
            } else {
                return null;
            }
        case 'DELETE':
            return null;
        default:
            return null;
    }
};