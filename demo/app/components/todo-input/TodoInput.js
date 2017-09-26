import { Element, DirtyType, h } from 'meno';

class TodoInput extends Element('todo-input') {
  get template() { 
    // return require('./todo-input.sass')(this.data);
    return h('template', [
      h('input', { type: 'textfield', placeholder: 'What to do?', name: 'textfield' })
    ]);
  }

  get styles() {
    return require('./todo-input.sass').toString();
  }

  get responsiveness() {
    return {
      keyup: 10.0
    }
  }

  get value() {
    return this.$('textfield').value
  }

  update(info) {
    if (this.isDirty(DirtyType.INPUT)) {
      this.handleKeyCodes(info[DirtyType.INPUT] && info[DirtyType.INPUT].keyUp);
    }
  }

  clear() {
    this.$('textfield').value = '';
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
