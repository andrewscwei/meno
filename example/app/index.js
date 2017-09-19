import 'stylesheets/main';

import m from 'meno';

// Order matters. Since TodoList contains TodoItem, TodoItem needs to be 
// registered first so that when TodoList renders its shadow DOM, TodoItem is 
// already in the element registry.
m(require('./components/TodoInput').default);
m(require('./components/TodoItem').default);
m(require('./components/TodoApp').default);

localStorage.debug = 'meno*';

if (module.hot) module.hot.accept();
