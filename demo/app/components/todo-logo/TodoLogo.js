import { Element, register, vdom } from 'meno';

class TodoLogo extends Element('todo-logo') {
  get template() { return vdom.createVTree(require('./todo-logo.pug')(this.data)); }

  get styles() { return require('./todo-logo.sass'); }
}

register(TodoLogo);
