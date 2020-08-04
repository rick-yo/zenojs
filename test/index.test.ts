import { observer, reactive, computed } from '../src';

describe('observer', () => {
  it('should works on Component', () => {
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

    const miniComponent: any = {
      data: {},
      setData(nextData: any) {
        this.data = {
          ...this.data,
          ...nextData,
        };
      },
      onInit() {
        observer(this, () => ({
          todos,
          done,
        }));
      },
      onUnload() {},
    };
    // setup
    miniComponent.onInit();

    // init
    expect(miniComponent.data.todos).toEqual(todos);

    // update
    addTodo('2');
    expect(miniComponent.data.todos).toEqual(todos);
    expect(done.value).toEqual(false);
    expect(miniComponent.data.done.value).toEqual(false);

    toggleCompleted(1, true);
    toggleCompleted(2, true);
    expect(done.value).toEqual(true);
    expect(miniComponent.data.done.value).toEqual(done.value);

    // dispose
    miniComponent.onUnload();
  });

  it('should works on Page', () => {
    const counter = reactive({
      value: 1,
    });

    function increase() {
      counter.value++;
    }

    const miniPage: any = {
      data: {
        value: 0,
      },
      setData(nextData: any) {
        this.data = {
          ...this.data,
          ...nextData,
        };
      },
      onLoad() {
        observer(this, () => counter);
      },
      didUnmount() {},
    };
    // setup
    miniPage.onLoad();
    // init
    expect(miniPage.data.value).toEqual(counter.value);
    // update
    increase();
    expect(miniPage.data.value).toEqual(counter.value);
    increase();
    expect(miniPage.data.value).toEqual(counter.value);
    // dispose
    miniPage.didUnmount();
  });

  it('should throw error', () => {
    expect(() => observer({} as any, 0 as any)).toThrowError();
  });
});
