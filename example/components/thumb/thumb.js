import { observer } from '../../../dist';
import { todos, done, toggleCompleted } from '../../store/todo';

const mapState = () => ({
  done: done.value
})

Component({
  mixins: [],
  data: {},
  props: {},
  didMount() {
    observer(this, mapState);
  },
  didUpdate() {},
  didUnmount() {},
  methods: {},
});
