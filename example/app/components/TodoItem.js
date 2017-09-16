import { Element, DirtyType } from 'meno';
import template from 'templates/components/todo-item';

class TodoItem extends Element('todo-item') {
  static get template() { return template; }

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
}

export default TodoItem;
