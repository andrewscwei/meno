import { Element, DirtyType } from 'meno';
import template from 'templates/components/todo-app';

class TodoApp extends Element('todo-app') {
  defaults() {
    return {
      items: [],
      filter: 'all',
      total: () => (this.data.items.length),
      totalActive: () => (this.data.items.reduce((total, item) => (total + (item.completed ? 0 : 1)), 0)),
      totalCompleted: () => (this.data.items.reduce((total, item) => (total + (item.completed ? 1 : 0)), 0)),
    }
  }

  render() {
    const entry = this.$('entry');
    entry.on('insert', this.onInsert.bind(this));

    const items = this.$('item') ? [].concat(this.$('item')) : [];
    const nItems = items.length;

    for (let i = 0; i < nItems; i++) {
      const item = items[i];
      item.on('toggle', this.onToggle.bind(this));
      item.on('delete', this.onDelete.bind(this));
    }

    this.$('button-all').addEventListener('click', (event) => this.data.filter = 'all');
    this.$('button-active').addEventListener('click', (event) => this.data.filter = 'active');
    this.$('button-completed').addEventListener('click', (event) => this.data.filter = 'completed');
  }

  onInsert(event) {
    const entry = event.currentTarget;

    this.data.items = this.data.items.concat([{
      text: entry.value,
      completed: false
    }]);
  }

  onToggle(event) {
    const item = event.currentTarget;
    const items = this.$('item') ? [].concat(this.$('item')) : [];
    const idx = items.indexOf(item);

    let tmp = [].concat(this.data.items);
    tmp[idx].completed = !tmp[idx].completed;
    this.data.items = tmp;
  }

  onDelete(event) {
    const item = event.currentTarget;
    const items = this.$('item') ? [].concat(this.$('item')) : [];
    const idx = items.indexOf(item);

    if (!~idx) return;
    
    let tmp = [].concat(this.data.items);
    tmp.splice(idx, 1);
    this.data.items = tmp;
  }

  template(data) { return template(data); }
}

export default TodoApp;
