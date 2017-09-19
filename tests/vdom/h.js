// © Andrew Wei

'use strict';

import assert from 'assert';
import h from 'vdom/h';

describe('vdom', () => {
  it('can convert HTML string to hyperscript', async function() {
    const htmlString = `<template><div is="todo-input" name="input"></div><div class="categories"><button class="active" name="button-all">All (0)</button><button name="button-active">Active (0)</button><button name="button-completed">Completed (0)</button></div><div class="list"></div></template>`;
    const tree = await h(htmlString);
  });
});
