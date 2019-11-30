import store from "../../store/todo";

Page({
  data: {
    inputValue: '',
  },

  onChange(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  add() {
    store.addTodo(this.data.inputValue)
    my.navigateBack();
  },
});
