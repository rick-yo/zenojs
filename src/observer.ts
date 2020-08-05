import equal from 'fast-deep-equal';
import { effect, stop } from '@vue/reactivity';

export type Context =
  | tinyapp.IPageInstance<any>
  | tinyapp.IComponentInstance<any, any>;

export type MapState<S> = () => S;

const mobxStateCacheKey = '__$stateCache__';

/**
 * 映射所需的数据到data
 * @param context 组件或页面的 this 指针
 * @param mapState 映射 state 到组件或页面
 * @returns {Function} disposer
 */
function observer<S>(context: Context, mapState: MapState<S>) {
  assert(isFunction(mapState), 'mapState 应是 function');

  const update = () => {
    const nextState = JSON.parse(JSON.stringify(mapState()));
    assert(isObject(nextState), 'mapState() 应返回一个对象');

    // 缓存 mapState() 防止 diff 组件上固有的 data
    const prevState = context[mobxStateCacheKey] || {};
    // diff 以提升性能
    const patchState = diff(prevState, nextState);
    context.setData(patchState);
    context[mobxStateCacheKey] = patchState;
  };

  const effectFn = effect(update);

  const onUnload = context.onUnload;
  const didUnmount = context.didUnmount;
  context.onUnload = (...args: any[]) => {
    stop(effectFn);
    isFunction(onUnload) && onUnload.apply(context, args);
  };

  context.didUnmount = (...args: any[]) => {
    stop(effectFn);
    isFunction(didUnmount) && didUnmount.apply(context, args);
  };
  return effectFn;
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
