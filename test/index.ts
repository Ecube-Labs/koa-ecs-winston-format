export function tools() {
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
