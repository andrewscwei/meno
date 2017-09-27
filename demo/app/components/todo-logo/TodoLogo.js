import { Element, register } from 'meno';
import createVTree from 'vdom/createVTree';

class TodoLogo extends Element('todo-logo') {
  get template() { return createVTree(require('./todo-logo.pug')(this.data)); }
  
  get styles() { return require('./todo-logo.sass'); }
}

register(TodoLogo);
