// © Andrew Wei

'use strict';

/**
 * @class
 * 
 * Virtual DOM text node.
 * 
 * @alias module:meno~vdom.VTextNode
 */
class VTextNode {
  /**
   * Creates a new VTextNode instance.
   * 
   * @param {string} text - The text for the text node.
   * 
   * @return {VTextNode} The created VTextNode instance.
   * 
   * @alias module:meno~vdom.VTextNode
   */
  constructor(text) {
    this.__private__ = {
      text: text
    };
  }

  get text() { return this.__private__.text; }
}

export default VTextNode;