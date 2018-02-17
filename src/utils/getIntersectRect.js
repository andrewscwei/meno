// © Andrew Wei

import getRect from './getRect';

/**
 * Computes the intersecting rect of 2 given elements. If only 1 element is
 * specified, the other element will default to the current viewport.
 *
 * @param {...Node}
 *
 * @return {Object} Object containing width, height.
 *
 * @alias module:meno~utils.getIntersectRect
 */
function getIntersectRect() {
  let n = arguments.length;

  if (n <= 0) throw new Error('This method requires at least 1 argument specified.');

  let rect = {};
  let currRect, nextRect;

  for (let i = 0; i < n; i++) {
    if (!currRect) currRect = getRect(arguments[i]);

    if (i === 0 && ((i + 1) === n)) {
      nextRect = getRect(window);
    }
    else if ((i + 1) < n) {
      nextRect = getRect(arguments[i + 1]);
    }
    else {
      break;
    }

    rect.width = Math.max(0.0, Math.min(currRect.right, nextRect.right) - Math.max(currRect.left, nextRect.left));
    rect.height = Math.max(0.0, Math.min(currRect.bottom, nextRect.bottom) - Math.max(currRect.top, nextRect.top));
    rect.top = Math.max(currRect.top, nextRect.top);
    rect.left = Math.max(currRect.left, nextRect.left);
    rect.bottom = rect.top + rect.height;
    rect.right = rect.left + rect.width;

    if (rect.width * rect.height === 0) {
      rect.width = 0;
      rect.height = 0;
      rect.top = 0;
      rect.left = 0;
      rect.bottom = 0;
      rect.right = 0;
    }

    currRect = rect;
  }

  return rect;
}

export default getIntersectRect;
