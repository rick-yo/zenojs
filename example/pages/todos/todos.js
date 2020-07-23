// 获取全局 app 实例
const app = getApp();
import { observer } from '../../../dist';
import store from '../../store/todo';

const mapState = () => ({
  todos: store.todos,
  done: store.done
})

Page({
  // 声明页面数据
  data: {},
  // 监听生命周期回调 onLoad
  onLoad() {
    observer(this, mapState)
    // 获取用户信息并存储数据
    app.getUserInfo().then(
      user => {
        this.setData({
          user,
        });
      },
      () => {
        // 获取用户信息失败
      }
    );
  },
  // 事件处理函数
  onTodoChanged(e) {
    // 修改全局数据
    const completed = e.detail.value;
    store.toggleCompleted(e.target.dataset.id, completed)
  },

  addTodo() {
    // 进行页面跳转
    my.navigateTo({ url: '../add-todo/add-todo' });
  },
});
