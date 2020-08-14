import nextTick from './nextTick';
import { isFunction } from './utils';

let queue: Function[] = [];

export function enqueueUpdate(callback: Function) {
  if (queue.push(callback) === 1) {
    nextTick(doUpdate);
  }
}

function doUpdate() {
  // const start = Date.now();
  const list = queue;
  queue = [];
  let job;
  while ((job = list.shift())) {
    isFunction(job) && job();
  }
  // console.log('doUpdate', Date.now() - start)
}
