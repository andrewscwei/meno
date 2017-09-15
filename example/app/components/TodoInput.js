// © Andrew Wei

'use strict';

import { Element, DirtyType } from 'meno';
import template from 'templates/components/todo-input';

class TodoInput extends Element('todo-input') {
  get value() {
    const input = this.$('input');
    if (!input.value || input.value === '') return null;
    return input.value;
  }

  init() {
    this.respondsTo(10.0, 'keyup');
    this.focus();
  }

  update() {
    if (this.isDirty(DirtyType.INPUT)) this.handleInput();
  }

  clear() {
    this.getChild('input').value = '';
  }

  focus() {
    this.getChild('input').focus();
  }

  handleInput() {
    this.focus();
    const keyCode = this.updateDelegate.keyCode.up;

    if (!keyCode || keyCode.length <= 0) return;

    if (~keyCode.indexOf(13)) {
      this.dispatchEvent(new Event('insert'));
      this.clear();
      // If this is not rerendered every time, this would work.
      // this.focus();
    }
    else if (~keyCode.indexOf(27)) {
      this.clear();
    }
  }

  template(data) { return template(data) }
}

export default TodoInput;
