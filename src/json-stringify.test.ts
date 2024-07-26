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
    const _child = new Child('child', 10, parent);
    const _child2 = new Child('child2', 20, parent);

    expect(() => JSON.stringify(parent)).toThrow('Converting circular structure to JSON');
    expect(JSON.parse(jsonStringify(parent))).toEqual({
      age: 40,
      children: [
        {
          age: 10,
          name: 'child',
          parent: '[Circular ~]',
          self: '[Circular ~.children.0]',
          siblings: '[Circular ~.children]',
        },
        {
          age: 20,
          name: 'child2',
          parent: '[Circular ~]',
          self: '[Circular ~.children.1]',
          siblings: '[Circular ~.children]',
        },
      ],
      name: 'parent',
    });

    const self: { self?: any } = {};
    self.self = self;

    expect(() => JSON.stringify(self)).toThrow('Converting circular structure to JSON');
    expect(JSON.parse(jsonStringify(self))).toEqual({
      self: '[Circular ~]',
    });
  });
});
