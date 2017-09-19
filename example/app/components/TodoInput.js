import { Element, DirtyType, h } from 'meno';

class TodoInput extends Element('todo-input') {
  get template() {
    return h('template', [
      h('input', { name: 'input-field', type: 'textfield', placeholder: 'What to do?' })
    ]);
  }

  get responsiveness() {
    return {
      keyup: 10.0
    }
  }

  get value() {
    const input = this.$('input-field');
    if (!input.value || input.value === '') return null;
    return input.value;
  }

  update(info) {
    if (this.isDirty(DirtyType.INPUT)) {
      this.handleKeyCodes(info[DirtyType.INPUT] && info[DirtyType.INPUT].keyUp);
    }
  }

  clear() {
    this.$('input-field').value = '';
  }

  focus() {
    this.$('input-field').focus();
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
