import { Element, DirtyType } from 'meno';
import createVTree from 'vdom/createVTree';
import template from 'templates/components/todo-item';

class TodoItem extends Element('todo-item') {
  get template() { 
    console.log(this.data)
    return createVTree(template(this.data)); 
  }

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
