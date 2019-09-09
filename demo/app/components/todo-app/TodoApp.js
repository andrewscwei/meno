import { DirtyType, Element, register, vdom } from 'meno';

class TodoApp extends Element(`todo-app`) {
  get template() { return vdom.createVTree(require(`./todo-app.pug`)(this.data)); }

  get styles() { return require(`./todo-app.sass`).toString(); }

  get responsiveness() {
    return {
      keyup: 10.0
    };
  }

  get defaults() {
    return {
      items: [],
      filter: `all`,
      total: () => (this.data.items.length),
      totalActive: () => (this.data.items.reduce((total, item) => (total + (item.completed ? 0 : 1)), 0)),
      totalCompleted: () => (this.data.items.reduce((total, item) => (total + (item.completed ? 1 : 0)), 0)),
    };
  }

  update(info) {
    if (this.isDirty(DirtyType.INPUT)) {
      this.handleKeyCodes(info[DirtyType.INPUT] && info[DirtyType.INPUT].keyUp);
    }
  }

  handleKeyCodes(keyCodes) {
    if (!keyCodes || keyCodes.length <= 0) return;

    if (~keyCodes.indexOf(27)) {
      this.data.items = [];
    }
  }

  onSelectAll(event) {
    this.data.filter = `all`;
  }

  onSelectActive(event) {
    this.data.filter = `active`;
  }

  onSelectCompleted(event) {
    this.data.filter = `completed`;
  }

  onInsert(event) {
    const input = event.currentTarget;
    const value = input.value === `` ? null : input.value;

    this.data.items = this.data.items.concat([{
      text: value,
      completed: false
    }]);
  }

  onToggle(event) {
    const item = event.currentTarget;
    const items = this.$(`item`) ? [].concat(this.$(`item`)) : [];
    const idx = items.indexOf(item);

    let tmp = [].concat(this.data.items);
    tmp[idx].completed = !tmp[idx].completed;
    this.data.items = tmp;
  }

  onDelete(event) {
    const item = event.currentTarget;
    const items = this.$(`item`) ? [].concat(this.$(`item`)) : [];
    const idx = items.indexOf(item);

    if (!~idx) return;

    let tmp = [].concat(this.data.items);
    tmp.splice(idx, 1);
    this.data.items = tmp;
  }
}

register(TodoApp);
