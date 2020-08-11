import { effect, stop } from '@vue/reactivity';
import { enqueueUpdate } from './enqueueUpdate';
import { assert, isFunction } from './utils';

export type Context =
  | tinyapp.IPageInstance<any>
  | tinyapp.IComponentInstance<any, any>;

export type MapState<S> = () => S;

// const mobxStateCacheKey = '__$stateCache__';

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
    context.setData(nextState);
    // assert(isObject(nextState), 'mapState() 应返回一个对象');

    // // 缓存 mapState() 防止 diff 组件上固有的 data
    // const prevState = context[mobxStateCacheKey] || {};
    // // diff 以提升性能
    // const patchState = diff(prevState, nextState);
    // const shouldUpdate = Object.keys(patchState).length;
    // if (shouldUpdate) {
    //   context.setData(patchState);
    //   context[mobxStateCacheKey] = nextState;
    // }
  };

  const job = effect(update, {
    scheduler(job) {
      enqueueUpdate(job);
    },
    // onTrigger(e) {
    //   console.log('onTrigger :>> ', e);
    // },
  });

  const onUnload = context.onUnload;
  const didUnmount = context.didUnmount;
  context.onUnload = (...args: any[]) => {
    stop(job);
    isFunction(onUnload) && onUnload.apply(context, args);
  };

  context.didUnmount = (...args: any[]) => {
    stop(job);
    isFunction(didUnmount) && didUnmount.apply(context, args);
  };
  return job;
}

export default observer;
