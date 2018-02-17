// © Andrew Wei

import setAttribute from '../dom/setAttribute';
import Directive from '../enums/Directive';
import vnode from './vnode';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
}

/**
 * Creates a DOM element from a VNode.
 *
 * @param {VNode} vnode - Target VNode instance.
 * @param {boolean} [isSVG=false] - Specifies whether the element is an SVG
 *                                  element or its child node.
 *
 * @alias module:meno~vdom.createElement
 */
function createElement(vnode, isSVG=false) {
  if (process.env.NODE_ENV === 'development') {
    assert((typeof vnode === 'string') || (typeof vnode.tag === 'string'), `Invalid vnode provided: ${vnode}`);
  }

  if (typeof vnode === 'string') return document.createTextNode(vnode);

  isSVG = isSVG || (vnode.tag === 'svg');

  // Create the DOM element, account for custom and SVG elements.
  const element = isSVG ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag) : document.createElement(vnode.tag, { is: vnode.attributes[Directive.IS] });

  // Set attributes.
  for (let key in vnode.attributes) {
    if (key === Directive.IS) continue;
    setAttribute(element, key, vnode.attributes[key], isSVG);
  }

  // Append child nodes.
  const children = vnode.children.map(child => (createElement(child, isSVG)));
  const n = children.length;

  for (let i = 0; i < n; i++) {
    element.appendChild(children[i]);
  }

  return element;
}

export default createElement;
