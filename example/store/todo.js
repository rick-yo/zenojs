import { reactive, computed } from '@vue/reactivity';

let idx = 1;

const perfData = new Array(3).fill(1).map((item, index) => {
  return {
    id: index,
    text: `Todo item ${index}`,
    completed: false
  }
})

const todos = reactive(perfData);

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
