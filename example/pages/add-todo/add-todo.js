import { addTodo } from "../../store/todo";

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
    addTodo(this.data.inputValue)
    my.navigateBack();
  },
});
