import equal from 'fast-deep-equal';
import { Context, MapState } from './type';
import cloneDeep from 'lodash/cloneDeep';

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

function onMount(context: Context, effect: Function) {
  const dispose = effect();
  const onUnload = context.onUnload;
  const didUnmount = context.didUnmount;
  context.onUnload = (...args: any[]) => {
    isFunction(dispose) && dispose();
    isFunction(onUnload) && onUnload.apply(context, args);
  };

  context.didUnmount = (...args: any[]) => {
    isFunction(dispose) && dispose();
    isFunction(didUnmount) && didUnmount.apply(context, args);
  };
}

const stateCacheKey = '__$stateCache__';

function mapStateToData<T>(
  context: Context,
  mapState: MapState<T>,
  cacheKey = stateCacheKey
) {
  const nextState = cloneDeep(mapState());
  assert(isObject(nextState), 'mapState() 应返回一个对象');

  // 缓存 mapState() 防止 diff 组件上固有的 data
  const prevState = context[cacheKey] || {};
  // diff 以提升性能
  const patchState = diff(prevState, nextState);
  const shouldUpdate = Object.keys(patchState).length;
  if (shouldUpdate) {
    context.setData(patchState);
    context[cacheKey] = nextState;
  }
}

export { isFunction, isObject, diff, assert, onMount, mapStateToData };
