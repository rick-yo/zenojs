import equal from 'fast-deep-equal';
import { autorun } from 'mobx';

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

  const update = (data: Dictionary) => {
    // FIXME 深拷贝以避免在小程序双进程架构下, observable 响应式失效的问题
    const nextdata: Dictionary = JSON.parse(JSON.stringify(data));
    // 缓存 mapState() 防止 diff 组件上固有的 data
    const oldData = context[MOBX_STATE_CACHE] || {};
    // diff 以提升性能
    const patchData = diff(oldData, nextdata);
    context[MOBX_STATE_CACHE] = patchData;
    context.setData(patchData);
  };

  const callback = () => {
    const data: Dictionary = mapState();
    assert(Boolean(data), 'mapState 应该返回对象');

    update(data);
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
