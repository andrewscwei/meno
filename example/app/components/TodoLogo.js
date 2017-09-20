import { Element, DirtyType } from 'meno';
import createVTree from 'vdom/createVTree';
import template from 'templates/components/todo-logo';

class TodoLogo extends Element('todo-logo') {
  get template() { return createVTree(template()); }
}

export default TodoLogo;
