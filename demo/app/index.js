import 'style-loader!./index.sass';

import '@webcomponents/webcomponentsjs';

// Order matters. Since TodoList contains TodoItem, TodoItem needs to be
// registered first so that when TodoList renders its shadow DOM, TodoItem is
// already in the element registry.

import 'components/todo-logo/TodoLogo';
import 'components/todo-input/TodoInput';
import 'components/todo-item/TodoItem';
import 'components/todo-app/TodoApp';

if (process.env.NODE_ENV === `development`) {
  localStorage.debug = `meno*`;
}

if (module.hot) module.hot.accept();
