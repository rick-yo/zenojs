# mobx-mini

Mobx 支付宝小程序的绑定

## Feature

1. 基于 Mobx，简单，灵活，性能强大
2. Typescript 友好

## API

#### `connect(context, mapState)`

```JavaScript
import { observable } from 'mobx';
import { connect } from 'mobx-mini';

const rootStore = observable({
  title: 'mobx-app'
});

const store = observable({
  count: 0,
  get isOdd() {
    return this.seconds % 2 === 1;
  },
  tick() {
    this.count += 1;
  }
});

const mapState = () => ({
  count: store.count,
  seconds: store.isOdd,
  title: rootStore.title,
});

// page
Page({
  add() {
    store.tick();
  },
  onLoad() {
    connect(this, mapState);
  },
});
```
