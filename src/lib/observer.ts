import equal from 'fast-deep-equal';
import { autorun, IObservableObject, toJS } from 'mobx';

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

  let prevData: Dictionary = {};
  let timer = 0;
  // 为了性能，需要 diff + debounce
  const update = (nextdata: Dictionary) => {
    Object.assign(prevData, nextdata);
    // @ts-ignore
    clearTimeout(timer);
    // @ts-ignore
    timer = setTimeout(() => {
      const patchData = diff(context.data, nextdata);
      context.setData(patchData);
      prevData = {};
    }, 40);
  };

  const callback = () => {
    const data: Dictionary = mapState();
    if (!data) {
      return;
    }
    // FIXME 需要遍历 + toJS, why ?
    const nextdata: Dictionary = {};
    for (const k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        nextdata[k] = toJS(data[k]);
      }
    }
    update(nextdata);
  };
  const disposer = autorun(callback);

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
