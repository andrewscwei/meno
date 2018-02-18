// © Andrew Wei

import DirtyType from '../enums/DirtyType';

if (process.env.NODE_ENV === `development`) {
  var assertType = require(`../debug/assertType`);
}

/**
 * Sets an attribute of an element by the attribute name.
 *
 * @param {Node} element - Target element.
 * @param {string} name - Attribute name.
 * @param {*} value - Attribute value.
 * @param {boolean} [isSVG=false] - Specifies whether the attribute is for an
 *                                  SVG element or its child nodes.
 *
 * @alias module:meno~dom.setAttribute
 */
function setAttribute(element, name, value, isSVG=false) {
  if (process.env.NODE_ENV === `development`) {
    assertType(element, Node, false, `Invalid element specified`);
  }

  isSVG = isSVG || element.tagName === `svg`;

  if (value === undefined || value === null || value === false) {
    if (isSVG) {
      element.removeAttributeNS(null, name);
    }
    else {
      element.removeAttribute(name);
    }
  }
  else if (value === true) {
    if (isSVG && !name.startsWith(`xmlns`)) {
      element.setAttributeNS(null, name, ``);
    }
    else {
      element.setAttribute(name, ``);
    }
  }
  else {
    if (isSVG && !name.startsWith(`xmlns`)) {
      element.setAttributeNS(null, name, value);
    }
    else {
      element.setAttribute(name, value);
    }
  }

  if (name === `disabled` && element.setDirty) {
    element.setDirty(DirtyType.STATE);
  }
}

export default setAttribute;
