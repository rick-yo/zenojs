import {
  autorun,
  IObservableObject,
  toJS
} from 'mobx';

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

  // let oldData: Dictionary = {};
  const update = (nextdata: Dictionary) => {
    // TODO 为了性能，这里需要深比较或者 diff
    context.setData(nextdata);
    // oldData = nextdata;
  };

  const callback = () => {
    // tslint:disable-next-line: no-let
    const data: Dictionary = isFunction(mapState)
      ? deriveDataFromFunction(mapState)
      : deriveDataFromStore(mapState);
    update(data);
  };
  const disposer = autorun(callback, { delay: 100 });

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

function deriveDataFromStore(store: IObservableObject): Dictionary {
  return toJS(store);
}

function deriveDataFromFunction(func: MapStateFunc): Dictionary {
  const data = func();
  return toJS(data);
}

export default connect;
