# zenojs

[![](https://img.shields.io/npm/v/zenojs.svg#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=80&status=done&style=none&width=80)](https://www.npmjs.com/package/zenojs) 
![](https://github.com/luvsic3/zenojs/workflows/CI/badge.svg#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=90&status=done&style=none&width=90) 
![](https://img.shields.io/badge/TypeScript-%E2%9C%93-007ACC.svg#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=88&status=done&style=none&width=88) 
[![](https://img.shields.io/github/license/luvsic3/zenojs.svg#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=78&status=done&style=none&width=78)](https://github.com/luvsic3/zenojs/blob/master/LICENSE)

> zeno，发音 /ˈzeɪnoʊ/ 。杰诺是漫画全职猎人中揍敌客家的前任当家，变化系能力者。绝招是 *龙头戏画* 和 *牙突* 。

轻量灵活的小程序状态管理框架

## Feature
1. 基于 `@vue/reactivity`，简单，灵活，性能优异
2. Typescript 友好

## 使用
### 全局 store
全局 store 和小程序应用的生命周期保持一致，可在多个页面、组件之间共享。
首先，定义 `/store/todo.js`
```javascript
import { reactive, computed } from 'zenojs';
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
```

映射状态到页面或组件 `/pages/todos/todos.js`

```javascript
import { todos, done, toggleCompleted } from '../../store/todo';
import { observer } from 'zenojs';

const mapState = () => ({
  todos,
  done
})

Page({
  add() {
    store.tick();
  },
  onLoad() {
    observer(this, mapState);
  },
});
```

在 axml 中访问状态和计算属性
```xml
<view a:for="{{todos}}">
  {{item.text}}
</view>
<view>All todo item has done ? {{done.value}}</view>
```

###  页面 store
页面 store 和页面实例的生命周期保持一致，多个页面实例之间的状态是隔离的，无法相互访问。

```JavaScript
import { provide, inject } from 'zenojs';

// store 初始化
const storeName = 'counter';

function setup() {
  const state = reactive({
    count: 0,
  });
  function increment() {
    state.count++;
  }
  return {
    state,
    increment,
  };
}

// 页面实例注册 store，同步 store 状态到 this.data
Page({
  onLoad() {
    provide(this, storeName, setup);
    // 访问 store 方法
    this.$store.increment();
  },
});

// 页面子组件消费 store，同步 store 状态到 this.data
Component({
  onInit() {
    inject(this, storeName);
    // 访问 store 方法
    this.$store.increment();
  },
});
```

## 最佳实践
### 状态管理和视图层解耦
store 应有独立的目录结构，不要和 page 或 component 放在一起
```
example
├── README.md
├── app.acss
├── app.js
├── app.json
├── assets
│   └── logo.png
├── components
│   ├── add-button
│   │   ├── add-button.acss
│   │   ├── add-button.axml
│   │   ├── add-button.js
│   │   └── add-button.json
│   └── counter
├── pages
│   ├── add-todo
│   │   ├── add-todo.acss
│   │   ├── add-todo.axml
│   │   ├── add-todo.js
│   │   └── add-todo.json
│   └── todos
│       ├── todos.acss
│       ├── todos.axml
│       ├── todos.js
│       └── todos.json
└── store
    └── todo.js
```
### 状态的更新应统一管理
不要在除 store 外的地方更新状态，见 `/example` 

## 注意
- 访问计算属性的要通过 `computedRef.value` 
- 处于性能考量，状态同步到视图层是异步的，你可能需要通过 `nextTick`  来获取更新后的 `this.data` 

## Example
见 `/example` 目录
