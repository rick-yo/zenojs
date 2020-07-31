import { reactive, computed } from '@vue/reactivity';

let idx = 1;

const todos = reactive([
  { id: '1', text: 'Learning Javascript', completed: true },
  { id: '2', text: 'Learning ES2016', completed: false },
  { id: '3', text: 'Learning 支付宝小程序', completed: true },
]);

const done = computed(() => todos.every(todo => todo.completed));

function toggleCompleted(id, completed) {
  const todo = todos.find(item => item.id === id);
  todo.completed = completed;
}

function addTodo(text) {
  todos.push({
    text,
    id: ++idx,
    completed: false,
  });
}

export { todos, done, toggleCompleted, addTodo };
