import { Element, h } from 'meno';
// import createVTree from 'vdom/createVTree';

class TodoItem extends Element('todo-item') {
  get template() { 
    // return createVTree(require('./todo-item.pug')(this.data));
    return h('template', [
      h('main', [
        h('span', { type: 'label', name: 'label', 'on:click': 'onToggle' }, [`${this.data.text}` || 'No description']),
        h('button', { type: 'button', name: 'delete', 'on:click': 'onDelete'}, ['Delete'])
      ])
    ]);
  }

  get styles() {
    return require('./todo-item.sass').toString();
  }

  defaults() {
    return {
      text: ''
    }
  }

  onToggle() {
    this.dispatchEvent(new Event('toggle'));
  }

  onDelete() {
    this.dispatchEvent(new Event('delete'));
  }
}

export default TodoItem;
