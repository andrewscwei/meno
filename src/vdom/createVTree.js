// © Andrew Wei

'use strict';

import htmlParser from 'htmlparser2';
import VNode from 'vdom/VNode';
import VTextNode from 'vdom/VTextNode';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
}

/**
 * Creates a virtual tree from an HTML string. A virtual tree is just a VNode
 * instance, which is the root node of a tree of VNodes.
 *
 * @param {string} htmlString - HTML string. Expects there to be exactly one 
 *                              root node.
 *
 * @return {VNode} - The virtual tree.
 *
 * @alias module:meno~utils.createVTree
 */
function createVTree(htmlString) {
  if (process.env.NODE_ENV === 'development') {
    assert(typeof htmlString === 'string', 'Param must be a valid HTML string');
  }

  let nodeStack = [];
  
  const parser = new htmlParser.Parser({
    onopentag: (name, attrs) => {
      const parentNode = nodeStack.length > 0 ? nodeStack[nodeStack.length - 1] : undefined;
      const node = new VNode(name, attrs || {});
      if (parentNode) parentNode.children.push(node);
      nodeStack.push(node);
    },
    ontext: (text) => {
      const parentNode = nodeStack.length > 0 ? nodeStack[nodeStack.length - 1] : undefined;
      const node = new VTextNode(text);
      if (parentNode) parentNode.children.push(node);
    },
    onclosetag: (tag) => {
      if (nodeStack.length > 1) nodeStack.pop();
    }
  });

  parser.write(htmlString);
  parser.end();

  if (process.env.NODE_ENV === 'development') {
    assert(nodeStack.length === 1, `The node stack is expected to have exactly 1 element, but it has ${nodeStack.length}. Make sure that the HTML string has exactly one root node.`);
  }

  return nodeStack.pop();
}

export default createVTree;