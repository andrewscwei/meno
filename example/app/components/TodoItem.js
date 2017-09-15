import { Element, DirtyType } from 'meno';
import template from 'templates/components/todo-item';

class TodoItem extends Element('todo-item') {
  render() {
    this.$('label').addEventListener('click', this.toggle.bind(this));
    this.$('delete').addEventListener('click', this.delete.bind(this));
  }

  toggle () {
    this.dispatchEvent(new Event('toggle'));
  }

  delete() {
    this.dispatchEvent(new Event('delete'));
  }

  template(data) { return template(data) }
}

export default TodoItem;
