import equal from 'fast-deep-equal';

function isFunction(fn: any): fn is Function {
  return typeof fn === 'function';
}

function isObject(val: any): val is object {
  return typeof val === 'object' && val !== null;
}

function diff<S>(ps: S, ns: S) {
  const value: Partial<S> = {};
  for (const k in ns) {
    if (k in ps) {
      if (!equal(ps[k], ns[k])) {
        value[k] = ns[k];
      }
    } else {
      value[k] = ns[k];
    }
  }
  return value;
}

function assert(value: boolean, message: string) {
  if (!Boolean(value)) throw new Error(message);
}

export { isFunction, isObject, diff, assert };
