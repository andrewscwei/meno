import { DirtyType, Element, register, vdom } from 'meno';

class TodoInput extends Element(`todo-input`) {
  get template() { return vdom.createVTree(require(`./todo-input.pug`)(this.data)); }

  get styles() {
    return require(`./todo-input.sass`).toString();
  }

  get responsiveness() {
    return {
      keyup: 10.0
    };
  }

  get value() {
    return this.$(`textfield`).value;
  }

  update(info) {
    if (this.isDirty(DirtyType.INPUT)) {
      this.handleKeyCodes(info[DirtyType.INPUT] && info[DirtyType.INPUT].keyUp);
    }
  }

  clear() {
    this.$(`textfield`).value = ``;
  }

  handleKeyCodes(keyCodes) {
    if (!keyCodes || keyCodes.length <= 0) return;

    this.focus();

    if (~keyCodes.indexOf(13)) {
      this.dispatchEvent(new Event(`insert`));
      this.clear();
    }
  }
}

register(TodoInput);
