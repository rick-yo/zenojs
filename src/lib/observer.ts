import equal from 'fast-deep-equal';
import {
  autorun,
} from 'mobx';

type Context =
  | tinyapp.IPageInstance<any>
  | tinyapp.IComponentInstance<any, any>;

type Dictionary = Record<string, any>;
type MapStateFunc = () => Dictionary;
type MapState = MapStateFunc;

/**
 * 映射所需的数据到data
 * @param {Object} context
 * @param {Function} mapState
 */
function observer(context: Context, mapState: MapState) {
  if (!isFunction(mapState)) {
    throw new TypeError('mapState 必须是一个function');
  }

  const update = (data: Dictionary) => {
    // FIXME 深拷贝以避免在小程序双进程架构下, observable 响应式失效的问题
    const nextdata: Dictionary = JSON.parse(JSON.stringify(data));
    // diff 以提升性能
    const patchData = diff(context.data, nextdata);
    context.setData(patchData);
  };

  const callback = () => {
    const data: Dictionary = mapState();
    if (!data) {
      return;
    }

    update(data);
  };

  const disposer = autorun(callback, {
    delay: 30,
    requiresObservable: true,
  });

  const onUnload = context.onUnload;
  const didUnmount = context.didUnmount;
  context.onUnload = () => {
    disposer();
    // tslint:disable-next-line: no-unused-expression
    isFunction(onUnload) && onUnload.apply(context, arguments);
  };

  context.didUnmount = () => {
    disposer();
    // tslint:disable-next-line: no-unused-expression
    isFunction(didUnmount) && didUnmount.apply(context, arguments);
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

export default observer;
