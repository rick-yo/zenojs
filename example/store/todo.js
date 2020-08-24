import { reactive, computed } from '../../dist';

let idx = 3;

const items = new Array(idx).fill(1).map((item, index) => {
  return {
    id: index,
    text: `Todo item ${index}`,
    completed: false,
  };
});

// 定义状态
const todos = reactive(items);

// 计算属性
const done = computed(() => todos.every(todo => todo.completed));

const completedTodos = computed(() => {
  const doneItems = todos.filter(todo => todo.completed);
  // my.setStorage 会导致 ios 10.3.2 12.4.4 appx2.0 上 doneItems 是 空对象 或 null
  // my.setStorage({
  //   key: 'doneItems',
  //   data: doneItems,
  // })
  console.log('doneItems :>> ', doneItems);
  return doneItems;
});

// 更新状态
function toggleCompleted(id, completed) {
  const todo = todos.find(item => item.id === id);
  todo.completed = completed;
}

function addTodo(text) {
  todos.unshift({
    text,
    id: ++idx,
    completed: false,
  });
}

export { todos, done, toggleCompleted, addTodo, completedTodos };
