import equal from 'fast-deep-equal';
import { autorun, trace } from 'mobx';

export type Context =
  | tinyapp.IPageInstance<any>
  | tinyapp.IComponentInstance<any, any>;

type Dictionary = Record<string, any>;
export type MapState = () => Dictionary;

const MOBX_STATE_CACHE = '__$mobxState';

/**
 * 映射所需的数据到data
 * @param {Object} context
 * @param {Function} mapState
 * @returns {Function} disposer
 */
function observer(context: Context, mapState: MapState) {
  assert(isFunction(mapState), 'mapState 应是 function');

  const update = (nextState: Dictionary) => {
    // 缓存 mapState() 防止 diff 组件上固有的 data
    const prevState = context[MOBX_STATE_CACHE] || {};
    // diff 以提升性能
    const patchState = diff(prevState, nextState);
    context.setData(patchState);
    // delay 以避免阻塞 setData
    context[MOBX_STATE_CACHE] = JSON.parse(JSON.stringify(patchState));
  };

  const callback = () => {
    const nextState: Dictionary = mapState();
    assert(Boolean(nextState), 'mapState 应该返回对象');

    update(nextState);
    trace();
  };

  const disposer = autorun(callback);

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

function diff(ps: Dictionary, ns: Dictionary) {
  const value: Dictionary = {};
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
