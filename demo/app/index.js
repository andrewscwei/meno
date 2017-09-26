import 'style-loader!./index.sass';

// import 'document-register-element';
import '@webcomponents/webcomponentsjs';

import m from 'meno';
import TodoLogo from 'components/todo-logo/TodoLogo';
import TodoInput from 'components/todo-input/TodoInput';
import TodoItem from 'components/todo-item/TodoItem';
import TodoApp from 'components/todo-app/TodoApp';

// Order matters. Since TodoList contains TodoItem, TodoItem needs to be 
// registered first so that when TodoList renders its shadow DOM, TodoItem is 
// already in the element registry.
m(TodoLogo);
m(TodoInput);
m(TodoItem);
m(TodoApp);

if (process.env.NODE_ENV === 'development') {
  localStorage.debug = ''; //'meno*';
}

if (module.hot) module.hot.accept();
