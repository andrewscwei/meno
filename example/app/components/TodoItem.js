import { Element, DirtyType, h } from 'meno';

class TodoItem extends Element('todo-item') {
  get template() { 
    return h('template', [
      h('span', { type: 'label', name: 'label' }, [this.data.text || 'No description']),
      h('button', { type: 'button', name: 'delete'}, ['Delete'])
    ]);
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
