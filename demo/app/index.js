import 'stylesheets/main';

import m from 'meno';
import TodoLogo from 'components/TodoLogo';
import TodoInput from 'components/TodoInput';
import TodoItem from 'components/TodoItem';
import TodoApp from 'components/TodoApp';

// Order matters. Since TodoList contains TodoItem, TodoItem needs to be 
// registered first so that when TodoList renders its shadow DOM, TodoItem is 
// already in the element registry.
m(TodoLogo);
m(TodoInput);
m(TodoItem);
m(TodoApp);

localStorage.debug = 'meno*';

if (module.hot) module.hot.accept();
