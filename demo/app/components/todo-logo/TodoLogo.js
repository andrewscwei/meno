import { Element, register } from 'meno';
import createVTree from 'vdom/createVTree';

const FooBar = Element('todo-logo');

class TodoLogo extends FooBar {
  get template() { return createVTree(require(`./todo-logo.pug`)(this.data)); }

  get styles() { return require(`./todo-logo.sass`); }
}

register(TodoLogo);
