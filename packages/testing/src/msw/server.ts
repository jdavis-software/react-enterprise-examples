import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer();

export function mockGET(url: string, json: any, status = 200) {
  server.use(http.get(url, () => HttpResponse.json(json, { status })));
}

export function mockPOST(url: string, json: any, status = 200) {
  server.use(http.post(url, () => HttpResponse.json(json, { status })));
}
