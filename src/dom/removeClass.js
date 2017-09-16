// © Andrew Wei

'use strict';

import assert from 'assert';

/**
 * Removes a class(es) from DOM element(s).
 *
 * @param {Node|Node[]} element - Target element(s).
 * @param {string|string[]} className - Class(es) to remove.
 *
 * @alias module:meno~dom.removeClass
 */
function removeClass(element, className) {
  let elements = [].concat(element);
  let classes = [];
  let n = elements.length;

  assert((typeof className === 'string') || (className instanceof Array), 'Invalid class name specified. Must be either a string or an array of strings.');

  if (typeof className === 'string') {
    classes.push(className);
  }
  else {
    classes = className;
  }

  let nClasses = classes.length;

  for (let i = 0; i < n; i++) {
    let e = elements[i];

    for (let j = 0; j < nClasses; j++) {
      let c = classes[j];

      assert(typeof c === 'string', 'Invalid class detected: ' + c);

      let regex = new RegExp('^' + c + '\\s+|\\s+' + c + '|^' + c + '$', 'g');
      e.className = e.className.replace(regex, '');
    }

    if (e.className === '') {
      e.removeAttribute('class');
    }
  }
}

export default removeClass;
