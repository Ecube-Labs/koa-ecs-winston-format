import { jsonStringify } from './json-stringify';

describe('jsonStringify', () => {
  class Parent {
    children: Child[] = [];

    constructor(
      public name: string,
      public age: number,
    ) {}
  }

  class Child {
    self: Child;

    siblings: Child[] = [];

    constructor(
      public name: string,
      public age: number,
      public parent: Parent,
    ) {
      parent.children.push(this);
      this.self = this;
      this.siblings = parent.children;
    }
  }

  test('circular reference', () => {
    const parent = new Parent('parent', 40);
    const child = new Child('child', 10, parent);
    const child2 = new Child('child2', 20, parent);

    expect(() => JSON.stringify(parent)).toThrow('Converting circular structure to JSON');
    expect(jsonStringify(parent)).toBe(
      '{"name":"parent","age":40,"children":[{"name":"child","age":10,"parent":"[Circular Parent]","siblings":"[Circular Array]","self":"[Circular Child]"},{"name":"child2","age":20,"parent":"[Circular Parent]","siblings":"[Circular Array]","self":"[Circular Child]"}]}',
    );
  });
});
