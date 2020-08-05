import nextTick from './nextTick';

let queue: Function[] = [];

export function enqueueUpdate(callback: Function) {
  queue.push(callback);
  nextTick(doUpdate);
}

function doUpdate() {
  const list = queue;
  queue = [];
  let update;
  while ((update = list.pop())) {
    update();
  }
}
