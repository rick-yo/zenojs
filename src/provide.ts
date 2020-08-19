import { reactive, ComputedRef, effect, stop } from '@vue/reactivity';
import { Context } from './type';
import { onMount, mapStateToData, assert, isObject, isFunction } from './utils';
import { enqueueUpdate } from './enqueueUpdate';

const PROVIDE_PREFIX = '__$provide_';

type Store = Record<
  string,
  ComputedRef | Function | ReturnType<typeof reactive>
>;

type Setup = () => Store;

function provide<T extends Setup>(
  context: Context,
  name: string,
  setup: T
): void {
  assert(isFunction(setup), 'provide: setup 必须是一个函数');
  const store = setup();
  context.$store = store;
  context[PROVIDE_PREFIX + name] = store;
  connect(context, store);
}

function inject(context: Context, name: string) {
  const store: Store = context.$page[PROVIDE_PREFIX + name];
  assert(isObject(store), 'inject: 无法根据 name 找到 store');
  context.$store = store;
  connect(context, store);
}

function connect(context: Context, store: Store) {
  onMount(context, () => {
    const job = effect(
      () => mapStateToData(context, () => store, '__$provideCache'),
      {
        scheduler(job) {
          enqueueUpdate(job);
        },
      }
    );
    return () => {
      stop(job);
    };
  });
}

export { provide, inject };
