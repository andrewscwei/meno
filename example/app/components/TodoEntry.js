// © Andrew Wei

'use strict';

import { Element, NodeState, DirtyType } from 'meno';
import template from 'templates/components/todo-entry';

class TodoEntry extends Element('todo-entry') {
  get value() {
    return this.getChild('input') && this.getChild('input').value || '';
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
    if (!keyCode || !~keyCode.indexOf(13)) return;
    this.dispatchEvent(new Event('insert'));
    this.clear();

    // If this is not rerendered every time, this would work.
    // this.focus();
  }

  template(data) { return template(data) }
}

export default TodoEntry;
