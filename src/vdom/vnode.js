// © Andrew Wei

/**
 *
 * Creates a new VNode instance.
 *
 * @param {string} tag - The element tag.
 * @param {Object} [attributes={}] - Attributes of the element.
 * @param {VNode[]} [children=[]] - Child vnodes of the element.
 *
 * @return {VNode} - Virtual node.
 *
 * @alias module:meno~vdom.vnode
 */
function vnode() {
  let args = Array.prototype.slice.call(arguments);
  let tag = args.shift();
  let attributes = (typeof args[0] === 'object' && !(args[0] instanceof Array)) ? args.shift() : {};
  let children = (args[0] instanceof Array) ? args.shift() : [];
  let text = args.length > 0 ? `${args.shift()}` : undefined;

  if (text !== undefined) return text;

  return {
    tag: tag,
    attributes: attributes,
    children: children,
  };
}

export default vnode;