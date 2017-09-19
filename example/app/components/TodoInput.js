import { Element, DirtyType } from 'meno';
import createVTree from 'vdom/createVTree';
import template from 'templates/components/todo-input';

class TodoInput extends Element('todo-input') {
  get template() { return createVTree(template(this.data)); }

  get responsiveness() {
    return {
      keyup: 10.0
    }
  }

  get value() {
    const input = this.$('input');
    if (!input.value || input.value === '') return null;
    return input.value;
  }

  update(info) {
    if (this.isDirty(DirtyType.INPUT)) {
      this.handleKeyCodes(info[DirtyType.INPUT] && info[DirtyType.INPUT].keyUp);
    }
  }

  clear() {
    this.getChild('input').value = '';
  }

  focus() {
    this.$('input').focus();
  }

  handleKeyCodes(keyCodes) {
    if (!keyCodes || keyCodes.length <= 0) return;

    this.focus();

    if (~keyCodes.indexOf(13)) {
      this.dispatchEvent(new Event('insert'));
      this.clear();
    }
    else if (~keyCodes.indexOf(27)) {
      this.clear();
    }
  }
}

export default TodoInput;
