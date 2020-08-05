# mobx-mini

<br />[![](https://img.shields.io/npm/v/mobx-mini.svg#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=80&status=done&style=none&width=80)](https://www.npmjs.com/package/mobx-mini) ![](https://github.com/luvsic3/mobx-mini/workflows/CI/badge.svg#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=90&status=done&style=none&width=90) ![](https://img.shields.io/badge/TypeScript-%E2%9C%93-007ACC.svg#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=88&status=done&style=none&width=88) [![](https://img.shields.io/github/license/luv-sic/mobx-mini.svg#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=78&status=done&style=none&width=78)](https://github.com/luvsic3/mobx-mini/blob/master/LICENSE)<br />
<br />Mobx 支付宝小程序的绑定<br />

<a name="Feature"></a>
## Feature

1. 基于 Mobx，简单，灵活，性能强大
1. Typescript 友好



<a name="API"></a>
## API
<a name="25cbf599"></a>
#### `observer(context, mapState)`
首先，定义 `/store/todo.js`<br />

```javascript
import { reactive, computed } from 'mobx-mini';

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
```

<br />映射状态到页面或组件 `/pages/todos/todos.js`<br />

```javascript
import { todos, done, toggleCompleted } from '../../store/todo';
import { observer } from 'mobx-mini';

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

<br />然后就能在 axml 中使用啦<br />

```xml
<view a:for="{{todos}}">
  {{item.text}}
</view>
<view>All todo item has done ? {{done.value}}</view>
```


<a name="34062b25"></a>
## 最佳实践
<a name="je3w3"></a>
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
<a name="tVRlz"></a>
### 状态的更新应统一管理
不要在除 store 外的地方更新状态，见 `/example` <br />

<a name="Example"></a>
## Example
见 `/example` 目录
