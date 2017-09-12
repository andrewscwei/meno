// © Andrew Wei

'use strict';

import 'webcomponents.js/webcomponents-lite';
import meno from 'meno.min';
import 'stylesheets/main';

// Register all components.
const req = require.context('./components', false, /^.*.js$/);
req.keys().forEach((path) => meno(req(path).default));

if (module.hot) module.hot.accept();
