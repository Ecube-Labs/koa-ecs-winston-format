export function jsonStringify(obj: Record<string, any>) {
  const refSet = new Set<Record<string, any>>();
  return JSON.stringify(obj, (_, value) => {
    if (typeof value === 'object' && value !== null) {
      if (refSet.has(value)) {
        return `[Circular ${value.constructor.name}]`;
      }
      refSet.add(value);
    }
    return value;
  });
}
