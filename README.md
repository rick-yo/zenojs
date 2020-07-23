# mobx-mini

[![npm](https://img.shields.io/npm/v/mobx-mini.svg)](https://www.npmjs.com/package/mobx-mini) 
[![Build Status](https://travis-ci.org/luv-sic/mobx-mini.svg?branch=master)](https://travis-ci.org/luv-sic/mobx-mini)
[![npm](https://img.shields.io/badge/TypeScript-%E2%9C%93-007ACC.svg)](https://www.typescriptlang.org/) 
[![GitHub license](https://img.shields.io/github/license/luv-sic/mobx-mini.svg)](https://github.com/luv-sic/mobx-mini/blob/master/LICENSE)

Mobx 支付宝小程序的绑定

## Feature

1. 基于 Mobx，简单，灵活，性能强大
2. Typescript 友好
3. 无模板代码

## API

#### `observer(context, mapState)`

首先，定义 store 并连接到页面

```JavaScript
import { observer, observable } from 'mobx-mini';

const rootStore = observable({
  title: 'mobx-app'
});

const store = observable({
  count: 0,
  get isOdd() {
    return this.count % 2 === 1;
  },
  tick() {
    this.count += 1;
  }
});

const mapState = () => ({
  count: store.count,
  isOdd: store.isOdd,
  title: rootStore.title,
});

// page
Page({
  add() {
    store.tick();
  },
  onLoad() {
    observer(this, mapState);
  },
});
```
然后就能在 axml 中使用啦
```html
<view>{{count}}</view>
```
## Example

见 `/example` 目录