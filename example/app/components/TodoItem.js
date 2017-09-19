import { Element, DirtyType, h } from 'meno';

class TodoItem extends Element('todo-item') {
  get template() { 
    return h('template', [
      h('span', { type: 'label', name: 'label', 'on:click': 'onToggle' }, [this.data.text || 'No description']),
      h('button', { type: 'button', name: 'delete', 'on:click': 'onDelete'}, ['Delete'])
    ]);
  }

  onToggle() {
    this.dispatchEvent(new Event('toggle'));
  }

  onDelete() {
    this.dispatchEvent(new Event('delete'));
  }
}

export default TodoItem;
