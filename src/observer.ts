import { effect, stop } from '@vue/reactivity';
import { enqueueUpdate } from './enqueueUpdate';
import { assert, isFunction, onMount, mapStateToData } from './utils';
import { Context, MapState } from './type';

/**
 * 映射所需的数据到data
 * @param context 组件或页面的 this 指针
 * @param mapState 映射 state 到组件或页面
 * @returns {Function} disposer
 */
function observer<S>(context: Context, mapState: MapState<S>) {
  assert(isFunction(mapState), 'mapState 应是 function');

  const update = () => {
    mapStateToData(context, mapState);
  };

  onMount(context, () => {
    const job = effect(update, {
      scheduler(job) {
        enqueueUpdate(job);
      },
      // onTrigger(e) {
      //   console.log('onTrigger :>> ', e);
      // },
    });
    return () => {
      stop(job);
    };
  });
}

export default observer;
