import { observer, reactive, computed, Context, nextTick } from '../src';

describe('observer', () => {
  it('should works on Component', async () => {
    let idx = 1;
    const todos = reactive([
      { id: 1, text: 'Learning Javascript', completed: true },
    ]);

    const done = computed(() => todos.every(todo => todo.completed));

    function toggleCompleted(id: number, completed: boolean) {
      const todo = todos.find(item => item.id === id);
      todo && (todo.completed = completed);
    }

    function addTodo(text: string) {
      todos.push({
        id: ++idx,
        text,
        completed: false,
      });
    }

    const miniComponent = createMiniAppComponent({
      onInit() {
        observer(this, () => ({
          todos,
          done,
        }));
      },
      onUnload() {},
    });
    // setup
    miniComponent.onInit();

    // init
    expect(miniComponent.data.todos).toEqual(todos);
    expect(done.value).toEqual(true);
    expect(miniComponent.data.done.value).toEqual(done.value);

    // update
    addTodo('todo item 2');
    await waitNextTick();
    expect(miniComponent.data.todos).toEqual(todos);
    expect(done.value).toEqual(false);
    expect(miniComponent.data.done.value).toEqual(done.value);

    toggleCompleted(2, true);
    await waitNextTick();
    expect(miniComponent.data.todos).toEqual(todos);
    expect(done.value).toEqual(true);
    expect(miniComponent.data.done.value).toEqual(done.value);

    // dispose
    miniComponent.onUnload();
    addTodo('todo item 3');
    expect(done.value).toEqual(false);
    expect(miniComponent.data.done.value).toEqual(true);
  });

  it('should works on Page', async () => {
    const counter = reactive({
      value: 1,
    });

    function increase() {
      counter.value++;
    }

    const miniPage = createMiniAppComponent({
      onLoad() {
        observer(this, () => counter);
      },
      didUnmount() {},
    });
    // setup
    miniPage.onLoad();
    // init
    expect(miniPage.data.value).toEqual(1);
    expect(miniPage.data.value).toEqual(counter.value);
    // update
    increase();
    await waitNextTick();
    expect(miniPage.data.value).toEqual(counter.value);
    increase();
    await waitNextTick();
    expect(miniPage.data.value).toEqual(counter.value);
    // dispose
    miniPage.didUnmount();
    increase();
    expect(counter.value).toEqual(4);
    expect(miniPage.data.value).toEqual(3);
  });

  it('should throw error', () => {
    expect(() => observer({} as Context, 0 as any)).toThrowError();
  });
});

function createMiniAppComponent<T>(
  options: tinyapp.PageOptions & tinyapp.ComponentOptions & T
) {
  return {
    data: {},
    setData(nextData: any) {
      this.data = {
        ...this.data,
        ...nextData,
      };
    },
    ...options,
  };
}

function waitNextTick() {
  return new Promise(resolve => nextTick(resolve));
}
