import { nextTick as _nextTick } from './nextTick';
import { observer as _observer } from './observer';
import {
  reactive as _reactive,
  computed as _computed,
  effect as _effect,
} from '@vue/reactivity';
import { provide as _provide, inject as _inject } from './provide';
import { Context, MapState } from './type';

// HACK 缓存模块，防止小程序分包加载时，全局状态管理失效
const observer = provideModule('__observer', _observer);
const reactive = provideModule('__reactive', _reactive);
const computed = provideModule('__computed', _computed);
const effect = provideModule('__effect', _effect);
const nextTick = provideModule('__nextTick', _nextTick);
const provide = provideModule('__provide', _provide);
const inject = provideModule('__inject', _inject);

export {
  observer,
  reactive,
  computed,
  effect,
  nextTick,
  provide,
  inject,
  MapState,
  Context,
};

function provideModule<T>(key: string, val: T): T {
  //@ts-ignore
  return getApp[key] || (getApp[key] = val);
}
