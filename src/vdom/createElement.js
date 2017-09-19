// © Andrew Wei

'use strict';

import setAttribute from 'dom/setAttribute';
import Directive from 'enums/Directive';
import vnode from 'vdom/vnode';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
}

/**
 * Creates a DOM element from a VNode.
 * 
 * @param {VNode} vnode - Target VNode instance.
 * 
 * @alias module:meno~vdom.createElement
 */
function createElement(vnode) {
  if (process.env.NODE_ENV === 'development') {
    assert((typeof vnode === 'string') || (typeof vnode.tag === 'string'), `Invalid vnode provided`);
  }

  if (typeof vnode === 'string') return document.createTextNode(vnode);

  // Create the DOM element, account for custom elements.
  const element = document.createElement(vnode.tag, { is: vnode.attributes[Directive.IS] });

  // Set attributes.
  for (let key in vnode.attributes) {
    if (key === Directive.IS) continue;
    setAttribute(element, key, vnode.attributes[key]);
  }

  // Append child nodes.
  const children = vnode.children.map(createElement);
  const n = children.length;

  for (let i = 0; i < n; i++) {
    element.appendChild(children[i]);
  }

  return element;
}

export default createElement;