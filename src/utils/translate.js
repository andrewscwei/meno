// © Andrew Wei

'use strict';

import assert from 'assert';

/**
 * Translates a DOM element.
 *
 * @param {Node|Node[]} element - Element(s) to perform the 3D translation.
 * @param {Object} [properties] - Translation properties (if unspecified, all
 *                                translation coordinates will be reset to 0).
 * @param {number} [properties.x] - X-coordinate.
 * @param {number} [properties.y] - Y-coordinate.
 * @param {number} [properties.z] - Z-coordinate.
 * @param {string} [properties.units='px'] - Unit of translations.
 * @param {Object} [constraints] - Translation constraints.
 * @param {number} [constraints.x] - Bounded x-coordinate.
 * @param {number} [constraints.y] - Bounded y-coordinate.
 * @param {number} [constraints.z] - Bounded z-coordinate.
 *
 * @return {Object} Translated properties.
 *
 * @alias module:meno~utils.translate
 */
function translate(element, properties, constraints) {
  let elements = [].concat(element);
  let n = elements.length;

  if (properties) {
    assert(properties.x === undefined || !isNaN(properties.x), 'X property must be a number.');
    assert(properties.y === undefined || !isNaN(properties.y), 'Y property must be a number.');
    assert(properties.z === undefined || !isNaN(properties.z), 'Z property must be a number.');

    let units = properties.units || 'px';

    if (constraints) {
      assert(constraints.x === undefined || !isNaN(constraints.x), 'X constraint must be a number.');
      assert(constraints.y === undefined || !isNaN(constraints.y), 'Y constraint must be a number.');
      assert(constraints.z === undefined || !isNaN(constraints.z), 'Z constraint must be a number.');
    }

    let x = (constraints && (constraints.x !== undefined)) ? Math.min(properties.x, constraints.x) : properties.x;
    let y = (constraints && (constraints.y !== undefined)) ? Math.min(properties.y, constraints.y) : properties.y;
    let z = (constraints && (constraints.z !== undefined)) ? Math.min(properties.z, constraints.z) : properties.z;

    let translateX = (properties.x !== undefined) ? 'translateX(' + x + units + ')' : null;
    let translateY = (properties.y !== undefined) ? 'translateY(' + y + units + ')' : null;
    let translateZ = (properties.z !== undefined) ? 'translateZ(' + z + units + ')' : null;
    let transforms = '';

    if (translateX) transforms += (transforms === '') ? translateX : ' ' + translateX;
    if (translateY) transforms += (transforms === '') ? translateY : ' ' + translateY;
    if (translateZ) transforms += (transforms === '') ? translateZ : ' ' + translateZ;

    for (let i = 0; i < n; i++) {
      elements[i].style.transform = transforms;
    }

    let t = {};

    if (translateX) t.x = x;
    if (translateY) t.y = y;
    if (translateZ) t.z = z;

    return t;
  }
  else {
    for (let j = 0; j < n; j++) {
      elements[j].style.transform = 'translateX(0) translateY(0) translateZ(0)';
    }

    return {
      x: 0,
      y: 0,
      z: 0
    };
  }
}

export default translate;
