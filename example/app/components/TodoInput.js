import { Element, DirtyType, h } from 'meno';

class TodoInput extends Element(HTMLInputElement, 'todo-input') {
  static get extends() { return 'input'; }

  get responsiveness() {
    return {
      keyup: 10.0
    }
  }

  update(info) {
    if (this.isDirty(DirtyType.INPUT)) {
      this.handleKeyCodes(info[DirtyType.INPUT] && info[DirtyType.INPUT].keyUp);
    }
  }

  clear() {
    this.value = '';
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
