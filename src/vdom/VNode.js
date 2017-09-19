// © Andrew Wei

'use strict';

/**
 * @class
 * 
 * Virtual DOM node.
 * 
 * @alias module:meno~vdom.VNode
 */
class VNode {
  /**
   * @class
   * 
   * Creates a new VNode instance.
   * 
   * @param {string} tag - The element tag.
   * @param {Object} [attributes={}] - Attributes of the element.
   * @param {VNode[]} [children=[]] - Child nodes of the element.
   * 
   * @return {VNode} - Virtual equivalent of a DOM node.
   * 
   * @alias module:meno~vdom.VNode
   */
  constructor() {
    let args = Array.prototype.slice.call(arguments);
    let tag = args.shift();
    let attributes = (typeof args[0] === 'object') ? args.shift() : {};
    let children = (args[0] instanceof Array) ? args.shift() : [];

    this.__private__ = {
      tag: tag,
      attributes: attributes,
      children: children
    };
  }

  get tag() { return this.__private__.tag; }

  get attributes() { return this.__private__.attributes; }

  get children() { return this.__private__.children; }
}

export default VNode;