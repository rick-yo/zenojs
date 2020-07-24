import { observer, observable } from '../src';

describe('observer', () => {
  it('should works on Component', () => {
    const store = observable({
      todos: [
        {
          title: '1',
          done: false,
        },
      ],
      get completed() {
        return this.todos.every((todo: Todo) => todo.done);
      },
      addTodo(title: string) {
        this.todos.push({
          title,
          done: false,
        });
      },
      doneTodo(title: string) {
        const todo = this.todos.find(todo => todo.title === title);
        if (todo) {
          todo.done = true;
        }
      },
    });

    const miniComponent: any = {
      data: {
        todos: [],
        completed: false,
      },
      setData(nextData: typeof miniComponent.data) {
        this.data = {
          ...this.data,
          ...nextData,
        };
      },
      onInit() {
        observer(this, () => store);
      },
      onUnload() {},
    };
    // setup
    miniComponent.onInit();

    // init
    expect(selectTitle(miniComponent.data.todos)).toEqual('1');
    // expect(miniComponent.data.completed).toEqual(false);

    // update
    store.addTodo('2');
    expect(selectTitle(miniComponent.data.todos)).toEqual('12');
    expect(store.completed).toEqual(false);
    // expect(miniComponent.data.completed).toEqual(false);

    store.doneTodo('1');
    store.doneTodo('2');
    expect(store.completed).toEqual(true);
    // expect(miniComponent.data.completed).toEqual(true);

    // dispose
    miniComponent.onUnload();
    expect(store.completed).toEqual(true);
    // expect(miniComponent.data.completed).toEqual(true);
    expect(selectTitle(miniComponent.data.todos)).toEqual('12');

    // should not react to
    store.addTodo('3');
    expect(store.completed).toEqual(false);
    // expect(miniComponent.data.completed).toEqual(true);
    expect(selectTitle(miniComponent.data.todos)).toEqual('12');
  });

  it('should works on Page', () => {
    const store = observable({
      count: 1,
      increase() {
        this.count++;
      },
    });

    const miniPage: any = {
      data: {
        count: 0,
      },
      setData(nextData: typeof miniPage.data) {
        this.data = Object.assign(this.data, nextData);
      },
      onLoad() {
        observer(this as any, () => store);
      },
      didUnmount() {},
    };
    // setup
    miniPage.onLoad();
    // init
    expect(miniPage.data.count).toEqual(1);
    // update
    store.increase();
    expect(miniPage.data.count).toEqual(2);
    store.increase();
    expect(miniPage.data.count).toEqual(3);
    // dispose
    miniPage.didUnmount();
    expect(miniPage.data.count).toEqual(3);
    // should not react to
    store.increase();
    expect(miniPage.data.count).toEqual(3);
  });

  it('should throw error', () => {
    expect(() => observer({} as any, 0 as any)).toThrowError();
  });
});

function selectTitle(todos: Todo[]) {
  return todos.map(todo => todo.title).join('');
}

interface Todo {
  title: string;
  done: boolean;
}
