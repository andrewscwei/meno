// © Andrew Wei

'use strict';

import 'webcomponents.js/CustomElements';
import 'stylesheets/main';
import m from 'meno';

// Order matters. Since Foo contains Bar, Bar needs to be registered first so
// that when Foo renders its shadow DOM, Bar is already in the element registry.
m(require('./components/Bar').default);
m(require('./components/Foo').default);

if (module.hot) module.hot.accept();
