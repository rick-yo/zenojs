import { autorun, IObservableObject } from 'mobx';

type Context =
  | tinyapp.IPageInstance<any>
  | tinyapp.IComponentInstance<any, any>;

type Dictionary = Record<string, any>;
type MapStateFunc = () => Dictionary;

type MapState = MapStateFunc & IObservableObject;

/**
 * 映射所需的数据到data
 * @param {Object} context
 * @param {Function} mapState
 */
function connect(context: Context, mapState: MapState) {
  if (!isFunction(mapState)) {
    throw new TypeError('mapState 必须是一个function');
  }

  const update = (nextdata: Dictionary) => {
    // TODO 为了性能，这里需要深比较或者 diff
    context.setData(nextdata);
  };

  const callback = () => {
    const data: Dictionary = isFunction(mapState) ? mapState() : mapState;
    if (!data) {
      return;
    }
    update(data);
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

export default connect;
