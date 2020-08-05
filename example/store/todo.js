import { reactive, computed } from '../../dist';

let idx = 3;

const items = new Array(idx).fill(1).map((item, index) => {
  return {
    id: index,
    text: `Todo item ${index}`,
    completed: false
  }
})

// 定义状态
const todos = reactive(items);

// 计算属性
const done = computed(() => todos.every(todo => todo.completed));

// 更新状态
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
