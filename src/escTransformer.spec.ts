import { Context } from "koa";
import { tools } from "../test";
import { ecsTransformer } from "./ecsTransformer";

const { mockDate, resetDate } = tools();

describe("ecsTransformer Test", () => {
  beforeAll(() => {
    mockDate(new Date("2022-01-10"));
  });

  afterAll(() => {
    resetDate();
  });

  test("request log format", () => {
    const requestLog = ecsTransformer({
      level: "info",
      message:
        "[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/v3/invoices\r\n<- 200 - 104ms",
      ctx: {
        request: {
          ip: "::ffff:172.18.0.1",
          socket: { remotePort: 59826 },
          method: "GET",
          header: {
            host: "localhost:8088",
            connection: "keep-alive",
            "sec-ch-ua":
              '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
            accept: "application/json, text/plain, */*",
            "filter-setting":
              '{"product":{"releaseDate":{"to":null,"from":null},"productType":"TTK","assembleStatus":"","invoiceNo":"","productCode":"","mainBoard":"","slaveBoard":"","ccnRegistration":"","link":false},"usim":{"usimActive":"","usimProfile":[],"link":false},"ccn":{"productUserIdx":[],"lastTelecom":"","clientType":"CCB","days":"","ccb":{"errorStatus":[],"currentStatus":[],"reportingType":[],"health":false},"ccp":{"errorStatus":[],"currentStatus":[],"reportingType":[],"voltage":false}},"tracker":{"productUserIdx":[]}}',
            "sec-ch-ua-mobile": "?0",
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3QGVjdWJlbGFicy5jb20iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsInRpbWV6b25lIjo5LCJ6b25lIjoiQXNpYS9TZW91bCIsImdyb3VwVHlwZXMiOlsiQWRtaW4iLCJNYW5hZ2VtZW50Il0sInBhcnRuZXIiOnsiY2NuSWR4IjpudWxsfSwiam9pbmVkQXQiOiIxOTcwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpYXQiOjE2NzI5NzA0ODksImV4cCI6MTY3MzU3NTI4OX0.OC_aQUXueLEbOQ67BKUvpzhSdGmRELOOQoHjmBqUwXw",
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            "sec-ch-ua-platform": '"macOS"',
            origin: "http://localhost:9000",
            "sec-fetch-site": "same-site",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            referer: "http://localhost:9000/",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          },
          body: {
            count: 1,
            data: [
              {
                idx: 1,
                customer_idx: 1,
                customer_manager_idx: 1,
                user_idx: 28,
                invoice_no: "A220725AL0010",
                type: "A",
                customer_country_code: "AL",
                customer_state: "경기도",
                customer_zip: "13494",
                customer_city: "성남시",
                customer_address_line1:
                  "경기도 성남시 분당구 판교역로 231 H'Square S동 908호",
                customer_address_line2: "111",
                note: "test",
                order: "[]",
                currency: "EUR",
                total_price: 0,
                shipping_price: 0,
                vat: 220202,
                charge_of_shipping: 0,
                product_status: 1,
                shipment_status: 0,
                payment_status: 0,
                order_status: 0,
                created_at: "2022-08-07T15:00:00.000Z",
                modified_at: "2022-10-19T08:09:02.000Z",
                warranty_period: 12,
                status: "Quotation",
                manager_name: "Danny (도길록)",
                customer_name: "드림컴퍼니",
                balance_amount: 0,
                payment_method: "kr",
                pickup_date: "2022-05-04T15:00:00.000Z",
                shipping_date: "2022-04-04T15:00:00.000Z",
                arrival_date: null,
              },
            ],
          },
        },
        req: { url: "/api/v3/invoices", httpVersion: "1.1" },
        URL: { href: "http://localhost:8088/api/v3/invoices" },
        response: {
          status: 200,
          headers: {
            "x-powered-by": "Express",
            vary: "Origin",
            "access-control-allow-origin": "http://localhost:9000",
            "content-type": "application/json; charset=utf-8",
          },
        },
      } as unknown as Context,
      user: { id: "1", name: "windy", email: "bm.yoon@ecubelabs.com" },
      txId: "b9612167-8cb4-43f2-a90e-e02cd259e81d",
    });

    //@ts-expect-error
    expect(requestLog[Symbol.for("message")]).toEqual(
      '{"@timestamp":"2022-01-10T00:00:00.000Z","log.level":"info","message":"[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/v3/invoices\\r\\n<- 200 - 104ms","ecs":{"version":"8.5.0"},"tags":["request"],"service":{},"host":{},"user":{"id":"1","name":"windy","email":"bm.yoon@ecubelabs.com"},"http":{"version":"1.1","request":{"id":"b9612167-8cb4-43f2-a90e-e02cd259e81d","method":"GET","headers":"{\\"host\\":\\"localhost:8088\\",\\"connection\\":\\"keep-alive\\",\\"sec-ch-ua\\":\\"\\\\\\"Not?A_Brand\\\\\\";v=\\\\\\"8\\\\\\", \\\\\\"Chromium\\\\\\";v=\\\\\\"108\\\\\\", \\\\\\"Google Chrome\\\\\\";v=\\\\\\"108\\\\\\"\\",\\"accept\\":\\"application/json, text/plain, */*\\",\\"filter-setting\\":\\"{\\\\\\"product\\\\\\":{\\\\\\"releaseDate\\\\\\":{\\\\\\"to\\\\\\":null,\\\\\\"from\\\\\\":null},\\\\\\"productType\\\\\\":\\\\\\"TTK\\\\\\",\\\\\\"assembleStatus\\\\\\":\\\\\\"\\\\\\",\\\\\\"invoiceNo\\\\\\":\\\\\\"\\\\\\",\\\\\\"productCode\\\\\\":\\\\\\"\\\\\\",\\\\\\"mainBoard\\\\\\":\\\\\\"\\\\\\",\\\\\\"slaveBoard\\\\\\":\\\\\\"\\\\\\",\\\\\\"ccnRegistration\\\\\\":\\\\\\"\\\\\\",\\\\\\"link\\\\\\":false},\\\\\\"usim\\\\\\":{\\\\\\"usimActive\\\\\\":\\\\\\"\\\\\\",\\\\\\"usimProfile\\\\\\":[],\\\\\\"link\\\\\\":false},\\\\\\"ccn\\\\\\":{\\\\\\"productUserIdx\\\\\\":[],\\\\\\"lastTelecom\\\\\\":\\\\\\"\\\\\\",\\\\\\"clientType\\\\\\":\\\\\\"CCB\\\\\\",\\\\\\"days\\\\\\":\\\\\\"\\\\\\",\\\\\\"ccb\\\\\\":{\\\\\\"errorStatus\\\\\\":[],\\\\\\"currentStatus\\\\\\":[],\\\\\\"reportingType\\\\\\":[],\\\\\\"health\\\\\\":false},\\\\\\"ccp\\\\\\":{\\\\\\"errorStatus\\\\\\":[],\\\\\\"currentStatus\\\\\\":[],\\\\\\"reportingType\\\\\\":[],\\\\\\"voltage\\\\\\":false}},\\\\\\"tracker\\\\\\":{\\\\\\"productUserIdx\\\\\\":[]}}\\",\\"sec-ch-ua-mobile\\":\\"?0\\",\\"authorization\\":\\"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3QGVjdWJlbGFicy5jb20iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsInRpbWV6b25lIjo5LCJ6b25lIjoiQXNpYS9TZW91bCIsImdyb3VwVHlwZXMiOlsiQWRtaW4iLCJNYW5hZ2VtZW50Il0sInBhcnRuZXIiOnsiY2NuSWR4IjpudWxsfSwiam9pbmVkQXQiOiIxOTcwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpYXQiOjE2NzI5NzA0ODksImV4cCI6MTY3MzU3NTI4OX0.OC_aQUXueLEbOQ67BKUvpzhSdGmRELOOQoHjmBqUwXw\\",\\"user-agent\\":\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36\\",\\"sec-ch-ua-platform\\":\\"\\\\\\"macOS\\\\\\"\\",\\"origin\\":\\"http://localhost:9000\\",\\"sec-fetch-site\\":\\"same-site\\",\\"sec-fetch-mode\\":\\"cors\\",\\"sec-fetch-dest\\":\\"empty\\",\\"referer\\":\\"http://localhost:9000/\\",\\"accept-encoding\\":\\"gzip, deflate, br\\",\\"accept-language\\":\\"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7\\"}","body":{"content":"{\\"count\\":1,\\"data\\":[{\\"idx\\":1,\\"customer_idx\\":1,\\"customer_manager_idx\\":1,\\"user_idx\\":28,\\"invoice_no\\":\\"A220725AL0010\\",\\"type\\":\\"A\\",\\"customer_country_code\\":\\"AL\\",\\"customer_state\\":\\"경기도\\",\\"customer_zip\\":\\"13494\\",\\"customer_city\\":\\"성남시\\",\\"customer_address_line1\\":\\"경기도 성남시 분당구 판교역로 231 H\'Square S동 908호\\",\\"customer_address_line2\\":\\"111\\",\\"note\\":\\"test\\",\\"order\\":\\"[]\\",\\"currency\\":\\"EUR\\",\\"total_price\\":0,\\"shipping_price\\":0,\\"vat\\":220202,\\"charge_of_shipping\\":0,\\"product_status\\":1,\\"shipment_status\\":0,\\"payment_status\\":0,\\"order_status\\":0,\\"created_at\\":\\"2022-08-07T15:00:00.000Z\\",\\"modified_at\\":\\"2022-10-19T08:09:02.000Z\\",\\"warranty_period\\":12,\\"status\\":\\"Quotation\\",\\"manager_name\\":\\"Danny (도길록)\\",\\"customer_name\\":\\"드림컴퍼니\\",\\"balance_amount\\":0,\\"payment_method\\":\\"kr\\",\\"pickup_date\\":\\"2022-05-04T15:00:00.000Z\\",\\"shipping_date\\":\\"2022-04-04T15:00:00.000Z\\",\\"arrival_date\\":null}]}"}},"response":{"status_code":200}},"trace":{"id":"b9612167-8cb4-43f2-a90e-e02cd259e81d"},"url":{"full":"http://localhost:8088/api/v3/invoices","path":"/api/v3/invoices"},"user_agent":{"original":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"},"client":{"address":"::ffff:172.18.0.1","ip":"::ffff:172.18.0.1","port":59826}}'
    );
  });

  test("error log format", () => {
    const errorLog = ecsTransformer({
      level: "error",
      message:
        "[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/v3/invoices\r\n<- 404 - 47ms",
      ctx: {
        request: {
          ip: "::ffff:172.18.0.1",
          socket: { remotePort: 61294 },
          method: "GET",
          header: {
            host: "localhost:8088",
            connection: "keep-alive",
            "sec-ch-ua":
              '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
            accept: "application/json, text/plain, */*",
            "filter-setting":
              '{"product":{"releaseDate":{"to":null,"from":null},"productType":"TTK","assembleStatus":"","invoiceNo":"","productCode":"","mainBoard":"","slaveBoard":"","ccnRegistration":"","link":false},"usim":{"usimActive":"","usimProfile":[],"link":false},"ccn":{"productUserIdx":[],"lastTelecom":"","clientType":"CCB","days":"","ccb":{"errorStatus":[],"currentStatus":[],"reportingType":[],"health":false},"ccp":{"errorStatus":[],"currentStatus":[],"reportingType":[],"voltage":false}},"tracker":{"productUserIdx":[]}}',
            "sec-ch-ua-mobile": "?0",
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3QGVjdWJlbGFicy5jb20iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsInRpbWV6b25lIjo5LCJ6b25lIjoiQXNpYS9TZW91bCIsImdyb3VwVHlwZXMiOlsiQWRtaW4iLCJNYW5hZ2VtZW50Il0sInBhcnRuZXIiOnsiY2NuSWR4IjpudWxsfSwiam9pbmVkQXQiOiIxOTcwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpYXQiOjE2NzI5NzA0ODksImV4cCI6MTY3MzU3NTI4OX0.OC_aQUXueLEbOQ67BKUvpzhSdGmRELOOQoHjmBqUwXw",
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            "sec-ch-ua-platform": '"macOS"',
            origin: "http://localhost:9000",
            "sec-fetch-site": "same-site",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            referer: "http://localhost:9000/",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          },
          body: {
            count: 1,
            data: [
              {
                idx: 1,
                customer_idx: 1,
                customer_manager_idx: 1,
                user_idx: 28,
                invoice_no: "A220725AL0010",
                type: "A",
                customer_country_code: "AL",
                customer_state: "경기도",
                customer_zip: "13494",
                customer_city: "성남시",
                customer_address_line1:
                  "경기도 성남시 분당구 판교역로 231 H'Square S동 908호",
                customer_address_line2: "111",
                note: "test",
                order: "[]",
                currency: "EUR",
                total_price: 0,
                shipping_price: 0,
                vat: 220202,
                charge_of_shipping: 0,
                product_status: 1,
                shipment_status: 0,
                payment_status: 0,
                order_status: 0,
                created_at: "2022-08-07T15:00:00.000Z",
                modified_at: "2022-10-19T08:09:02.000Z",
                warranty_period: 12,
                status: "Quotation",
                manager_name: "Danny (도길록)",
                customer_name: "드림컴퍼니",
                balance_amount: 0,
                payment_method: "kr",
                pickup_date: "2022-05-04T15:00:00.000Z",
                shipping_date: "2022-04-04T15:00:00.000Z",
                arrival_date: null,
              },
            ],
          },
        },
        req: { url: "/api/v3/invoices", httpVersion: "1.1" },
        URL: { href: "http://localhost:8088/api/v3/invoices" },
        response: {
          status: 404,
          headers: {
            "x-powered-by": "Express",
            vary: "Origin",
            "access-control-allow-origin": "http://localhost:9000",
            "content-type": "application/json; charset=utf-8",
          },
        },
      } as unknown as Context,
      user: { id: "1", name: "windy", email: "bm.yoon@ecubelabs.com" },
      txId: "b9612167-8cb4-43f2-a90e-e02cd259e81d",
      err: {
        name: "error",
        message: "error",
        stack:
          "Error: errror\n    at handler (/erp-api/src/routes/api/v3/invoices/get.ts:177:15)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at validator (/erp-api/node_modules/koa-joi-router/joi-router.js:428:5)\n    at noopMiddleware (/erp-api/node_modules/koa-joi-router/joi-router.js:267:10)\n    at specExposer (/erp-api/node_modules/koa-joi-router/joi-router.js:452:5)\n    at prepareRequest (/erp-api/node_modules/koa-joi-router/joi-router.js:464:3)\n    at requestLoggerMiddleware (/erp-api/src/middlewares/request-logger.ts:10:9)\n    at errorHandlerMiddleware (/erp-api/src/middlewares/error-handler.ts:68:9)\n    at userHandlerMiddleware (/erp-api/src/middlewares/auth-handler.ts:28:5)\n    at dependencyInjectorMiddleware (/erp-api/src/middlewares/dependency-injector.ts:15:9)",
      },
    });

    //@ts-expect-error
    expect(errorLog[Symbol.for("message")]).toEqual(
      '{"@timestamp":"2022-01-10T00:00:00.000Z","log.level":"error","message":"[GET, b9612167-8cb4-43f2-a90e-e02cd259e81d] -> /api/v3/invoices\\r\\n<- 404 - 47ms","ecs":{"version":"8.5.0"},"tags":["request"],"service":{},"host":{},"user":{"id":"1","name":"windy","email":"bm.yoon@ecubelabs.com"},"http":{"version":"1.1","request":{"id":"b9612167-8cb4-43f2-a90e-e02cd259e81d","method":"GET","headers":"{\\"host\\":\\"localhost:8088\\",\\"connection\\":\\"keep-alive\\",\\"sec-ch-ua\\":\\"\\\\\\"Not?A_Brand\\\\\\";v=\\\\\\"8\\\\\\", \\\\\\"Chromium\\\\\\";v=\\\\\\"108\\\\\\", \\\\\\"Google Chrome\\\\\\";v=\\\\\\"108\\\\\\"\\",\\"accept\\":\\"application/json, text/plain, */*\\",\\"filter-setting\\":\\"{\\\\\\"product\\\\\\":{\\\\\\"releaseDate\\\\\\":{\\\\\\"to\\\\\\":null,\\\\\\"from\\\\\\":null},\\\\\\"productType\\\\\\":\\\\\\"TTK\\\\\\",\\\\\\"assembleStatus\\\\\\":\\\\\\"\\\\\\",\\\\\\"invoiceNo\\\\\\":\\\\\\"\\\\\\",\\\\\\"productCode\\\\\\":\\\\\\"\\\\\\",\\\\\\"mainBoard\\\\\\":\\\\\\"\\\\\\",\\\\\\"slaveBoard\\\\\\":\\\\\\"\\\\\\",\\\\\\"ccnRegistration\\\\\\":\\\\\\"\\\\\\",\\\\\\"link\\\\\\":false},\\\\\\"usim\\\\\\":{\\\\\\"usimActive\\\\\\":\\\\\\"\\\\\\",\\\\\\"usimProfile\\\\\\":[],\\\\\\"link\\\\\\":false},\\\\\\"ccn\\\\\\":{\\\\\\"productUserIdx\\\\\\":[],\\\\\\"lastTelecom\\\\\\":\\\\\\"\\\\\\",\\\\\\"clientType\\\\\\":\\\\\\"CCB\\\\\\",\\\\\\"days\\\\\\":\\\\\\"\\\\\\",\\\\\\"ccb\\\\\\":{\\\\\\"errorStatus\\\\\\":[],\\\\\\"currentStatus\\\\\\":[],\\\\\\"reportingType\\\\\\":[],\\\\\\"health\\\\\\":false},\\\\\\"ccp\\\\\\":{\\\\\\"errorStatus\\\\\\":[],\\\\\\"currentStatus\\\\\\":[],\\\\\\"reportingType\\\\\\":[],\\\\\\"voltage\\\\\\":false}},\\\\\\"tracker\\\\\\":{\\\\\\"productUserIdx\\\\\\":[]}}\\",\\"sec-ch-ua-mobile\\":\\"?0\\",\\"authorization\\":\\"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3QGVjdWJlbGFicy5jb20iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOjEsInRpbWV6b25lIjo5LCJ6b25lIjoiQXNpYS9TZW91bCIsImdyb3VwVHlwZXMiOlsiQWRtaW4iLCJNYW5hZ2VtZW50Il0sInBhcnRuZXIiOnsiY2NuSWR4IjpudWxsfSwiam9pbmVkQXQiOiIxOTcwLTAxLTAxVDAwOjAwOjAwLjAwMFoiLCJpYXQiOjE2NzI5NzA0ODksImV4cCI6MTY3MzU3NTI4OX0.OC_aQUXueLEbOQ67BKUvpzhSdGmRELOOQoHjmBqUwXw\\",\\"user-agent\\":\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36\\",\\"sec-ch-ua-platform\\":\\"\\\\\\"macOS\\\\\\"\\",\\"origin\\":\\"http://localhost:9000\\",\\"sec-fetch-site\\":\\"same-site\\",\\"sec-fetch-mode\\":\\"cors\\",\\"sec-fetch-dest\\":\\"empty\\",\\"referer\\":\\"http://localhost:9000/\\",\\"accept-encoding\\":\\"gzip, deflate, br\\",\\"accept-language\\":\\"ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7\\"}","body":{"content":"{\\"count\\":1,\\"data\\":[{\\"idx\\":1,\\"customer_idx\\":1,\\"customer_manager_idx\\":1,\\"user_idx\\":28,\\"invoice_no\\":\\"A220725AL0010\\",\\"type\\":\\"A\\",\\"customer_country_code\\":\\"AL\\",\\"customer_state\\":\\"경기도\\",\\"customer_zip\\":\\"13494\\",\\"customer_city\\":\\"성남시\\",\\"customer_address_line1\\":\\"경기도 성남시 분당구 판교역로 231 H\'Square S동 908호\\",\\"customer_address_line2\\":\\"111\\",\\"note\\":\\"test\\",\\"order\\":\\"[]\\",\\"currency\\":\\"EUR\\",\\"total_price\\":0,\\"shipping_price\\":0,\\"vat\\":220202,\\"charge_of_shipping\\":0,\\"product_status\\":1,\\"shipment_status\\":0,\\"payment_status\\":0,\\"order_status\\":0,\\"created_at\\":\\"2022-08-07T15:00:00.000Z\\",\\"modified_at\\":\\"2022-10-19T08:09:02.000Z\\",\\"warranty_period\\":12,\\"status\\":\\"Quotation\\",\\"manager_name\\":\\"Danny (도길록)\\",\\"customer_name\\":\\"드림컴퍼니\\",\\"balance_amount\\":0,\\"payment_method\\":\\"kr\\",\\"pickup_date\\":\\"2022-05-04T15:00:00.000Z\\",\\"shipping_date\\":\\"2022-04-04T15:00:00.000Z\\",\\"arrival_date\\":null}]}"}},"response":{"status_code":404}},"trace":{"id":"b9612167-8cb4-43f2-a90e-e02cd259e81d"},"url":{"full":"http://localhost:8088/api/v3/invoices","path":"/api/v3/invoices"},"user_agent":{"original":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"},"client":{"address":"::ffff:172.18.0.1","ip":"::ffff:172.18.0.1","port":61294},"error":{"message":"error","stack_trace":"Error: errror\\n    at handler (/erp-api/src/routes/api/v3/invoices/get.ts:177:15)\\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\\n    at validator (/erp-api/node_modules/koa-joi-router/joi-router.js:428:5)\\n    at noopMiddleware (/erp-api/node_modules/koa-joi-router/joi-router.js:267:10)\\n    at specExposer (/erp-api/node_modules/koa-joi-router/joi-router.js:452:5)\\n    at prepareRequest (/erp-api/node_modules/koa-joi-router/joi-router.js:464:3)\\n    at requestLoggerMiddleware (/erp-api/src/middlewares/request-logger.ts:10:9)\\n    at errorHandlerMiddleware (/erp-api/src/middlewares/error-handler.ts:68:9)\\n    at userHandlerMiddleware (/erp-api/src/middlewares/auth-handler.ts:28:5)\\n    at dependencyInjectorMiddleware (/erp-api/src/middlewares/dependency-injector.ts:15:9)"}}'
    );
  });
});
