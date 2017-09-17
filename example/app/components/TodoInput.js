import { Element, DirtyType } from 'meno';
import template from 'templates/components/todo-input';

class TodoInput extends Element('todo-input') {
  static get template() { return template; }

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
      console.log(info[DirtyType.INPUT])
      this.handleKeyCodes(info[DirtyType.INPUT] && info[DirtyType.INPUT].keyUp);
    }
  }

  render() {
    this.focus();
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
      // If this is not rerendered every time, this would work.
      // this.focus();
    }
    else if (~keyCodes.indexOf(27)) {
      this.clear();
    }
  }
}

export default TodoInput;
