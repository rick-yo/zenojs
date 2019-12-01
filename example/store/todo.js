import { observable } from 'mobx';

let idx = 100;

const store = observable({
  todos: [
    { id: '1', text: 'Learning Javascript', completed: true },
    { id: '2', text: 'Learning ES2016', completed: false },
    { id: '3', text: 'Learning 支付宝小程序', completed: true }
  ],
  get done() {
    return this.todos.every(todo => todo.completed);
  },
  toggleCompleted(id, completed) {
    const todo = this.todos.find(item => item.id === id)
    todo.completed = completed;
  },
  addTodo(text) {
    this.todos.push({
      text,
      id: ++idx,
      completed: false
    })
  },
});

export default store;
