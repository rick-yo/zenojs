// @ts-nocheck
import equal from 'fast-deep-equal';
import { watch } from '@vue/runtime-core';

export type Context =
  | tinyapp.IPageInstance<any>
  | tinyapp.IComponentInstance<any, any>;

export type MapState<S> = () => S;

/**
 * 映射所需的数据到data
 * @param {Object} context
 * @param {Function} mapState
 * @returns {Function} disposer
 */
function observer<S>(context: Context, mapState: MapState<S>) {
  assert(isFunction(mapState), 'mapState 应是 function');

  const update = (nextState: S, prevState: S) => {
    // 缓存 mapState() 防止 diff 组件上固有的 data
    // diff 以提升性能
    // const patchState = diff(prevState, nextState);
    context.setData(nextState);
  };

  const callback = (nextState: S, prevState: S) => {
    assert(isObject(nextState), 'mapState() 应返回一个对象');

    update(nextState, prevState);
  };

  const disposer = watch(mapState, callback, {
    deep: true,
  });

  callback(mapState(), {} as S);

  const onUnload = context.onUnload;
  const didUnmount = context.didUnmount;
  context.onUnload = (...args: any[]) => {
    disposer();
    isFunction(onUnload) && onUnload.apply(context, args);
  };

  context.didUnmount = (...args: any[]) => {
    disposer();
    isFunction(didUnmount) && didUnmount.apply(context, args);
  };
  return disposer;
}

function isFunction(fn: any): boolean {
  return typeof fn === 'function';
}

function isObject(val: any): boolean {
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

export default observer;
