function serializer() {
  const stack: any[] = [];
  const keys: string[] = [];

  function cycleReplacer(key: string, value: any) {
    if (stack[0] === value) return '[Circular ~]';
    return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
  }

  return function (this: any, key: string, value: any) {
    if (stack.length > 0) {
      const thisPos = stack.indexOf(this);
      if (thisPos !== -1) {
        stack.splice(thisPos + 1);
        keys.splice(thisPos, Infinity, key);
      } else {
        stack.push(this);
        keys.push(key);
      }
      if (stack.indexOf(value) !== -1) {
        value = cycleReplacer.call(this, key, value);
      }
    } else {
      stack.push(value);
    }

    return value;
  };
}

export function jsonStringify(obj: any, spaces: any = null) {
  return JSON.stringify(obj, serializer(), spaces);
}
