import { Context } from 'koa';
import { ecsTransformer } from './ecsTransformer';

function tools() {
  let _Date: typeof Date;

  function mockDate(value: number | string | Date) {
    const now = new Date(value);
    _Date = global.Date;
    // @ts-ignore
    global.Date = class extends Date {
      constructor(value?: number | string | Date) {
        if (value) {
          super(value);
          // eslint-disable-next-line no-constructor-return
          return this;
        }
        // eslint-disable-next-line no-constructor-return
        return now;
      }
    };
    // @ts-ignore
    global.Date.now = jest.fn(() => new Date(value));
  }

  function resetDate() {
    global.Date = _Date;
  }

  return { mockDate, resetDate };
}

const { mockDate, resetDate } = tools();

describe('ecsTransformer Test', () => {
  beforeAll(() => {
    mockDate(new Date('2022-01-10'));
  });

  afterAll(() => {
    resetDate();
  });

  test('request log format', () => {
    const requestLog = ecsTransformer({
      level: 'info',
      message: '[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/test\r\n<- 200 - 104ms',
      ctx: {
        request: {
          ip: '::ffff:172.18.0.1',
          socket: { remotePort: 59826 },
          method: 'GET',
          header: {
            host: 'localhost:8088',
            connection: 'keep-alive',
            'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua-mobile': '?0',
            authorization: 'Bearer testcodetoken',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'sec-ch-ua-platform': '"macOS"',
            origin: 'http://localhost:9000',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            referer: 'http://localhost:9000/',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          },
          body: {
            count: 1,
            data: [
              {
                id: 1,
                name: 'TEST00001',
                note: 'test',
                price: 1000000,
                createDate: '2023-01-01T15:00:00.000Z',
              },
            ],
          },
        },
        req: { url: '/api/test', httpVersion: '1.1' },
        URL: { href: 'http://localhost:8088/api/test' },
        response: {
          status: 200,
          headers: {
            'x-powered-by': 'Express',
            vary: 'Origin',
            'access-control-allow-origin': 'http://localhost:9000',
            'content-type': 'application/json; charset=utf-8',
          },
        },
      } as unknown as Context,
      user: { id: '1', name: 'windy', email: 'bm.yoon@ecubelabs.com' },
      txId: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
    });

    // @ts-expect-error
    expect(JSON.parse(requestLog[Symbol.for('message')])).toEqual({
      '@timestamp': '2022-01-10T00:00:00.000Z',
      client: {
        port: 59826,
      },
      ecs: {
        version: '8.10.0',
      },
      host: {},
      http: {
        request: {
          body: {
            content:
              '{"count":1,"data":[{"id":1,"name":"TEST00001","note":"test","price":1000000,"createDate":"2023-01-01T15:00:00.000Z"}]}',
          },
          headers:
            '{"host":"localhost:8088","connection":"keep-alive","sec-ch-ua":"\\"Not?A_Brand\\";v=\\"8\\", \\"Chromium\\";v=\\"108\\", \\"Google Chrome\\";v=\\"108\\"","accept":"application/json, text/plain, */*","sec-ch-ua-mobile":"?0","authorization":"Bearer testcodetoken","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36","sec-ch-ua-platform":"\\"macOS\\"","origin":"http://localhost:9000","sec-fetch-site":"same-site","sec-fetch-mode":"cors","sec-fetch-dest":"empty","referer":"http://localhost:9000/","accept-encoding":"gzip, deflate, br","accept-language":"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"}',
          id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
          method: 'GET',
        },
        response: {
          status_code: 200,
        },
        version: '1.1',
      },
      log: {
        level: 'info',
      },
      message: '[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/test\r\n<- 200 - 104ms',
      service: {},
      tags: ['request'],
      trace: {
        id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
      },
      url: {
        full: 'http://localhost:8088/api/test',
        path: '/api/test',
      },
      user: {
        email: 'bm.yoon@ecubelabs.com',
        id: '1',
        name: 'windy',
      },
      user_agent: {
        original:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
    });
  });

  test('error log format', () => {
    const errorLog = ecsTransformer({
      level: 'error',
      message: '[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/test\r\n<- 404 - 47ms',
      ctx: {
        request: {
          ip: '::ffff:172.18.0.1',
          socket: { remotePort: 61294 },
          method: 'GET',
          header: {
            host: 'localhost:8088',
            connection: 'keep-alive',
            'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua-mobile': '?0',
            authorization: 'Bearer testcodetoken',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'sec-ch-ua-platform': '"macOS"',
            origin: 'http://localhost:9000',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            referer: 'http://localhost:9000/',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
          },
          body: {
            count: 1,
            data: [
              {
                id: 1,
                name: 'TEST00001',
                note: 'test',
                price: 1000000,
                createDate: '2023-01-01T15:00:00.000Z',
              },
            ],
          },
        },
        req: { url: '/api/test', httpVersion: '1.1' },
        URL: { href: 'http://localhost:8088/api/test' },
        response: {
          status: 404,
          headers: {
            'x-powered-by': 'Express',
            vary: 'Origin',
            'access-control-allow-origin': 'http://localhost:9000',
            'content-type': 'application/json; charset=utf-8',
          },
        },
      } as unknown as Context,
      user: { id: '1', name: 'windy', email: 'bm.yoon@ecubelabs.com' },
      txId: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
      err: {
        name: 'error',
        message: 'error',
        stack:
          'Error: error\n    at handler (/erp-api/src/routes/api/v3/invoices/get.ts:177:15)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at validator (/erp-api/node_modules/koa-joi-router/joi-router.js:428:5)\n    at noopMiddleware (/erp-api/node_modules/koa-joi-router/joi-router.js:267:10)\n    at specExposer (/erp-api/node_modules/koa-joi-router/joi-router.js:452:5)\n    at prepareRequest (/erp-api/node_modules/koa-joi-router/joi-router.js:464:3)\n    at requestLoggerMiddleware (/erp-api/src/middlewares/request-logger.ts:10:9)\n    at errorHandlerMiddleware (/erp-api/src/middlewares/error-handler.ts:68:9)\n    at userHandlerMiddleware (/erp-api/src/middlewares/auth-handler.ts:28:5)\n    at dependencyInjectorMiddleware (/erp-api/src/middlewares/dependency-injector.ts:15:9)',
      },
    });

    // @ts-expect-error
    expect(JSON.parse(errorLog[Symbol.for('message')])).toEqual({
      '@timestamp': '2022-01-10T00:00:00.000Z',
      client: {
        port: 61294,
      },
      ecs: {
        version: '8.10.0',
      },
      error: {
        message: 'error',
        name: 'error',
        stack:
          'Error: error\n    at handler (/erp-api/src/routes/api/v3/invoices/get.ts:177:15)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at validator (/erp-api/node_modules/koa-joi-router/joi-router.js:428:5)\n    at noopMiddleware (/erp-api/node_modules/koa-joi-router/joi-router.js:267:10)\n    at specExposer (/erp-api/node_modules/koa-joi-router/joi-router.js:452:5)\n    at prepareRequest (/erp-api/node_modules/koa-joi-router/joi-router.js:464:3)\n    at requestLoggerMiddleware (/erp-api/src/middlewares/request-logger.ts:10:9)\n    at errorHandlerMiddleware (/erp-api/src/middlewares/error-handler.ts:68:9)\n    at userHandlerMiddleware (/erp-api/src/middlewares/auth-handler.ts:28:5)\n    at dependencyInjectorMiddleware (/erp-api/src/middlewares/dependency-injector.ts:15:9)',
        stack_trace:
          'Error: error\n    at handler (/erp-api/src/routes/api/v3/invoices/get.ts:177:15)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at validator (/erp-api/node_modules/koa-joi-router/joi-router.js:428:5)\n    at noopMiddleware (/erp-api/node_modules/koa-joi-router/joi-router.js:267:10)\n    at specExposer (/erp-api/node_modules/koa-joi-router/joi-router.js:452:5)\n    at prepareRequest (/erp-api/node_modules/koa-joi-router/joi-router.js:464:3)\n    at requestLoggerMiddleware (/erp-api/src/middlewares/request-logger.ts:10:9)\n    at errorHandlerMiddleware (/erp-api/src/middlewares/error-handler.ts:68:9)\n    at userHandlerMiddleware (/erp-api/src/middlewares/auth-handler.ts:28:5)\n    at dependencyInjectorMiddleware (/erp-api/src/middlewares/dependency-injector.ts:15:9)',
      },
      host: {},
      http: {
        request: {
          body: {
            content:
              '{"count":1,"data":[{"id":1,"name":"TEST00001","note":"test","price":1000000,"createDate":"2023-01-01T15:00:00.000Z"}]}',
          },
          headers:
            '{"host":"localhost:8088","connection":"keep-alive","sec-ch-ua":"\\"Not?A_Brand\\";v=\\"8\\", \\"Chromium\\";v=\\"108\\", \\"Google Chrome\\";v=\\"108\\"","accept":"application/json, text/plain, */*","sec-ch-ua-mobile":"?0","authorization":"Bearer testcodetoken","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36","sec-ch-ua-platform":"\\"macOS\\"","origin":"http://localhost:9000","sec-fetch-site":"same-site","sec-fetch-mode":"cors","sec-fetch-dest":"empty","referer":"http://localhost:9000/","accept-encoding":"gzip, deflate, br","accept-language":"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"}',
          id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
          method: 'GET',
        },
        response: {
          status_code: 404,
        },
        version: '1.1',
      },
      log: {
        level: 'error',
      },
      message: `[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/test\r\n<- 404 - 47ms`,
      service: {},
      tags: ['request'],
      trace: {
        id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
      },
      url: {
        full: 'http://localhost:8088/api/test',
        path: '/api/test',
      },
      user: {
        email: 'bm.yoon@ecubelabs.com',
        id: '1',
        name: 'windy',
      },
      user_agent: {
        original:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
    });
  });

  describe('client 필드에 대한 테스트', () => {
    test('1순위로는 x-forwarded-for 중 가장 왼쪽 IP를 최초 client IP로 간주한다.', () => {
      const requestLog = ecsTransformer({
        level: 'info',
        message: '[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/test\r\n<- 200 - 104ms',
        ctx: {
          request: {
            ip: '::ffff:172.18.0.1',
            socket: { remotePort: 59826, remoteAddress: '255.255.255.255' },
            method: 'GET',
            header: {
              host: 'localhost:8088',
              connection: 'keep-alive',
              'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
              accept: 'application/json, text/plain, */*',
              'sec-ch-ua-mobile': '?0',
              authorization: 'Bearer testcodetoken',
              'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
              'sec-ch-ua-platform': '"macOS"',
              origin: 'http://localhost:9000',
              'sec-fetch-site': 'same-site',
              'sec-fetch-mode': 'cors',
              'sec-fetch-dest': 'empty',
              referer: 'http://localhost:9000/',
              'accept-encoding': 'gzip, deflate, br',
              'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
              'x-real-ip': '200.123.123.267',
              'x-forwarded-for': '200.123.123.267, 111.222.111.222',
            },
            body: {
              count: 1,
              data: [
                {
                  id: 1,
                  name: 'TEST00001',
                  note: 'test',
                  price: 1000000,
                  createDate: '2023-01-01T15:00:00.000Z',
                },
              ],
            },
          },
          req: { url: '/api/test', httpVersion: '1.1' },
          URL: { href: 'http://localhost:8088/api/test' },
          response: {
            status: 200,
            headers: {
              'x-powered-by': 'Express',
              vary: 'Origin',
              'access-control-allow-origin': 'http://localhost:9000',
              'content-type': 'application/json; charset=utf-8',
            },
          },
        } as unknown as Context,
        user: { id: '1', name: 'windy', email: 'bm.yoon@ecubelabs.com' },
        txId: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
      });

      // @ts-expect-error
      expect(JSON.parse(requestLog[Symbol.for('message')])).toEqual({
        '@timestamp': '2022-01-10T00:00:00.000Z',
        client: {
          address: '200.123.123.267',
          ip: '200.123.123.267',
          port: 59826,
        },
        ecs: {
          version: '8.10.0',
        },
        host: {},
        http: {
          request: {
            body: {
              content:
                '{"count":1,"data":[{"id":1,"name":"TEST00001","note":"test","price":1000000,"createDate":"2023-01-01T15:00:00.000Z"}]}',
            },
            headers:
              '{"host":"localhost:8088","connection":"keep-alive","sec-ch-ua":"\\"Not?A_Brand\\";v=\\"8\\", \\"Chromium\\";v=\\"108\\", \\"Google Chrome\\";v=\\"108\\"","accept":"application/json, text/plain, */*","sec-ch-ua-mobile":"?0","authorization":"Bearer testcodetoken","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36","sec-ch-ua-platform":"\\"macOS\\"","origin":"http://localhost:9000","sec-fetch-site":"same-site","sec-fetch-mode":"cors","sec-fetch-dest":"empty","referer":"http://localhost:9000/","accept-encoding":"gzip, deflate, br","accept-language":"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7","x-real-ip":"200.123.123.267","x-forwarded-for":"200.123.123.267, 111.222.111.222"}',
            id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
            method: 'GET',
          },
          response: {
            status_code: 200,
          },
          version: '1.1',
        },
        log: {
          level: 'info',
        },
        message: `[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/test\r\n<- 200 - 104ms`,
        service: {},
        tags: ['request'],
        trace: {
          id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
        },
        url: {
          full: 'http://localhost:8088/api/test',
          path: '/api/test',
        },
        user: {
          email: 'bm.yoon@ecubelabs.com',
          id: '1',
          name: 'windy',
        },
        user_agent: {
          original:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        },
      });
    });

    test('x-forwarded-for가 없으면 2순위로 x-real-ip를 최초 client IP로 간주한다.', () => {
      const requestLog = ecsTransformer({
        level: 'info',
        message: '[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/test\r\n<- 200 - 104ms',
        ctx: {
          request: {
            ip: '::ffff:172.18.0.1',
            socket: { remotePort: 59826, remoteAddress: '255.255.255.255' },
            method: 'GET',
            header: {
              host: 'localhost:8088',
              connection: 'keep-alive',
              'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
              accept: 'application/json, text/plain, */*',
              'sec-ch-ua-mobile': '?0',
              authorization: 'Bearer testcodetoken',
              'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
              'sec-ch-ua-platform': '"macOS"',
              origin: 'http://localhost:9000',
              'sec-fetch-site': 'same-site',
              'sec-fetch-mode': 'cors',
              'sec-fetch-dest': 'empty',
              referer: 'http://localhost:9000/',
              'accept-encoding': 'gzip, deflate, br',
              'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
              'x-real-ip': '100.200.255.255',
            },
            body: {
              count: 1,
              data: [
                {
                  id: 1,
                  name: 'TEST00001',
                  note: 'test',
                  price: 1000000,
                  createDate: '2023-01-01T15:00:00.000Z',
                },
              ],
            },
          },
          req: { url: '/api/test', httpVersion: '1.1' },
          URL: { href: 'http://localhost:8088/api/test' },
          response: {
            status: 200,
            headers: {
              'x-powered-by': 'Express',
              vary: 'Origin',
              'access-control-allow-origin': 'http://localhost:9000',
              'content-type': 'application/json; charset=utf-8',
            },
          },
        } as unknown as Context,
        user: { id: '1', name: 'windy', email: 'bm.yoon@ecubelabs.com' },
        txId: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
      });

      // @ts-expect-error
      expect(JSON.parse(requestLog[Symbol.for('message')])).toEqual({
        '@timestamp': '2022-01-10T00:00:00.000Z',
        client: {
          address: '100.200.255.255',
          ip: '100.200.255.255',
          port: 59826,
        },
        ecs: {
          version: '8.10.0',
        },
        host: {},
        http: {
          request: {
            body: {
              content:
                '{"count":1,"data":[{"id":1,"name":"TEST00001","note":"test","price":1000000,"createDate":"2023-01-01T15:00:00.000Z"}]}',
            },
            headers:
              '{"host":"localhost:8088","connection":"keep-alive","sec-ch-ua":"\\"Not?A_Brand\\";v=\\"8\\", \\"Chromium\\";v=\\"108\\", \\"Google Chrome\\";v=\\"108\\"","accept":"application/json, text/plain, */*","sec-ch-ua-mobile":"?0","authorization":"Bearer testcodetoken","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36","sec-ch-ua-platform":"\\"macOS\\"","origin":"http://localhost:9000","sec-fetch-site":"same-site","sec-fetch-mode":"cors","sec-fetch-dest":"empty","referer":"http://localhost:9000/","accept-encoding":"gzip, deflate, br","accept-language":"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7","x-real-ip":"100.200.255.255"}',
            id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
            method: 'GET',
          },
          response: {
            status_code: 200,
          },
          version: '1.1',
        },
        log: {
          level: 'info',
        },
        message: '[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/test\r\n<- 200 - 104ms',
        service: {},
        tags: ['request'],
        trace: {
          id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
        },
        url: {
          full: 'http://localhost:8088/api/test',
          path: '/api/test',
        },
        user: {
          email: 'bm.yoon@ecubelabs.com',
          id: '1',
          name: 'windy',
        },
        user_agent: {
          original:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        },
      });
    });

    test('x-real-ip가 없으면 3순위로 remoteAddress를 client IP로 간주한다', () => {
      const requestLog = ecsTransformer({
        level: 'info',
        message: '[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/test\r\n<- 200 - 104ms',
        ctx: {
          request: {
            ip: '::ffff:172.18.0.1',
            socket: { remotePort: 59826, remoteAddress: '255.255.255.255' },
            method: 'GET',
            header: {
              host: 'localhost:8088',
              connection: 'keep-alive',
              'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
              accept: 'application/json, text/plain, */*',
              'sec-ch-ua-mobile': '?0',
              authorization: 'Bearer testcodetoken',
              'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
              'sec-ch-ua-platform': '"macOS"',
              origin: 'http://localhost:9000',
              'sec-fetch-site': 'same-site',
              'sec-fetch-mode': 'cors',
              'sec-fetch-dest': 'empty',
              referer: 'http://localhost:9000/',
              'accept-encoding': 'gzip, deflate, br',
              'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            },
            body: {
              count: 1,
              data: [
                {
                  id: 1,
                  name: 'TEST00001',
                  note: 'test',
                  price: 1000000,
                  createDate: '2023-01-01T15:00:00.000Z',
                },
              ],
            },
          },
          req: { url: '/api/test', httpVersion: '1.1' },
          URL: { href: 'http://localhost:8088/api/test' },
          response: {
            status: 200,
            headers: {
              'x-powered-by': 'Express',
              vary: 'Origin',
              'access-control-allow-origin': 'http://localhost:9000',
              'content-type': 'application/json; charset=utf-8',
            },
          },
        } as unknown as Context,
        user: { id: '1', name: 'windy', email: 'bm.yoon@ecubelabs.com' },
        txId: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
      });

      // @ts-expect-error
      expect(JSON.parse(requestLog[Symbol.for('message')])).toEqual({
        '@timestamp': '2022-01-10T00:00:00.000Z',
        client: {
          address: '255.255.255.255',
          ip: '255.255.255.255',
          port: 59826,
        },
        ecs: {
          version: '8.10.0',
        },
        host: {},
        http: {
          request: {
            body: {
              content:
                '{"count":1,"data":[{"id":1,"name":"TEST00001","note":"test","price":1000000,"createDate":"2023-01-01T15:00:00.000Z"}]}',
            },
            headers:
              '{"host":"localhost:8088","connection":"keep-alive","sec-ch-ua":"\\"Not?A_Brand\\";v=\\"8\\", \\"Chromium\\";v=\\"108\\", \\"Google Chrome\\";v=\\"108\\"","accept":"application/json, text/plain, */*","sec-ch-ua-mobile":"?0","authorization":"Bearer testcodetoken","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36","sec-ch-ua-platform":"\\"macOS\\"","origin":"http://localhost:9000","sec-fetch-site":"same-site","sec-fetch-mode":"cors","sec-fetch-dest":"empty","referer":"http://localhost:9000/","accept-encoding":"gzip, deflate, br","accept-language":"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"}',
            id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
            method: 'GET',
          },
          response: {
            status_code: 200,
          },
          version: '1.1',
        },
        log: {
          level: 'info',
        },
        message: '[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/test\r\n<- 200 - 104ms',
        service: {},
        tags: ['request'],
        trace: {
          id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
        },
        url: {
          full: 'http://localhost:8088/api/test',
          path: '/api/test',
        },
        user: {
          email: 'bm.yoon@ecubelabs.com',
          id: '1',
          name: 'windy',
        },
        user_agent: {
          original:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        },
      });
    });
  });

  describe('device 필드', () => {
    test('device 필드가 존재하는 경우', () => {
      const errorLog = ecsTransformer({
        level: 'error',
        message: 'Task parseAndValidate aborted with Error: Failed to parse payload.',
        txId: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
        err: {
          name: 'ProtocolError',
          message: 'Failed to parse payload',
          stack:
            'ProtocolError: Failed to parse payload\n    at Object.parseAndValidate (/tracker-server/apps/tracker-server/app/tasks/parseAndValidate.ts:34:15)\n    at applyFunction (/tracker-server/apps/tracker-server/app/flow.js:149:39)\n    at /tracker-server/node_modules/async/dist/async.js:151:38\n    at runTask (/tracker-server/node_modules/async/dist/async.js:1157:17)\n    at /tracker-server/node_modules/async/dist/async.js:1093:35\n    at processQueue (/tracker-server/node_modules/async/dist/async.js:1103:17)\n    at Object.auto (/tracker-server/node_modules/async/dist/async.js:1090:9)\n    at Object.mainFlow (/tracker-server/apps/tracker-server/app/flow.js:33:15)\n    at /tracker-server/apps/tracker-server/app/routes/index.ts:33:14\n    at dispatch (/tracker-server/node_modules/@koa/router/node_modules/koa-compose/index.js:44:32)',
        },
        device: {
          id: '89314404000652545956',
        },
      });

      // @ts-expect-error
      expect(JSON.parse(errorLog[Symbol.for('message')])).toEqual({
        '@timestamp': '2022-01-10T00:00:00.000Z',
        client: {},
        device: {
          id: '89314404000652545956',
        },
        ecs: {
          version: '8.10.0',
        },
        error: {
          message: 'Failed to parse payload',
          name: 'ProtocolError',
          stack:
            'ProtocolError: Failed to parse payload\n    at Object.parseAndValidate (/tracker-server/apps/tracker-server/app/tasks/parseAndValidate.ts:34:15)\n    at applyFunction (/tracker-server/apps/tracker-server/app/flow.js:149:39)\n    at /tracker-server/node_modules/async/dist/async.js:151:38\n    at runTask (/tracker-server/node_modules/async/dist/async.js:1157:17)\n    at /tracker-server/node_modules/async/dist/async.js:1093:35\n    at processQueue (/tracker-server/node_modules/async/dist/async.js:1103:17)\n    at Object.auto (/tracker-server/node_modules/async/dist/async.js:1090:9)\n    at Object.mainFlow (/tracker-server/apps/tracker-server/app/flow.js:33:15)\n    at /tracker-server/apps/tracker-server/app/routes/index.ts:33:14\n    at dispatch (/tracker-server/node_modules/@koa/router/node_modules/koa-compose/index.js:44:32)',
          stack_trace:
            'ProtocolError: Failed to parse payload\n    at Object.parseAndValidate (/tracker-server/apps/tracker-server/app/tasks/parseAndValidate.ts:34:15)\n    at applyFunction (/tracker-server/apps/tracker-server/app/flow.js:149:39)\n    at /tracker-server/node_modules/async/dist/async.js:151:38\n    at runTask (/tracker-server/node_modules/async/dist/async.js:1157:17)\n    at /tracker-server/node_modules/async/dist/async.js:1093:35\n    at processQueue (/tracker-server/node_modules/async/dist/async.js:1103:17)\n    at Object.auto (/tracker-server/node_modules/async/dist/async.js:1090:9)\n    at Object.mainFlow (/tracker-server/apps/tracker-server/app/flow.js:33:15)\n    at /tracker-server/apps/tracker-server/app/routes/index.ts:33:14\n    at dispatch (/tracker-server/node_modules/@koa/router/node_modules/koa-compose/index.js:44:32)',
        },
        host: {},
        http: {
          request: {
            id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
          },
          response: {},
        },
        log: {
          level: 'error',
        },
        message: 'Task parseAndValidate aborted with Error: Failed to parse payload.',
        service: {},
        tags: ['request'],
        trace: {
          id: 'b9612167-8cb4-43f2-a90e-e02cd259e81d',
        },
        url: {},
        user_agent: {},
      });
    });
  });
});
