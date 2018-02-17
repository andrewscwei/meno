// © Andrew Wei

if (process.env.NODE_ENV === 'development') {
  var debug = require('debug')('meno:register');
  var assert = require('assert');
}

/**
 * Wraps the native Document.registerElement() and registers a custom element
 * with the DOM while storing it in the registry.
 *
 * @param {string} tagOrClass - <the-tag> of the registered element class or the
 *                              class itself (in this case the second param is
 *                              not needed).
 * @param {Function|Object} options - Either a class to base the element on or
 *                                    an object literal containing additional
 *                                    options of the registration.
 * @param {Class} [options.prototype] - Element class prototype to base the
 *                                      custom element on.
 * @param {Class} [options.class] - Element class to base the custom element on,
 *                                  takes priority over prototype.
 * @param {string} [options.extends] - Existing tag to extend.
 *
 * @return {Class} The registered class.
 *
 * @see Document.registerElement()
 *
 * @alias module:meno~dom.register
 */
function register(ElementClass) {
  if (process.env.NODE_ENV === 'development') {
    assert(typeof ElementClass === 'function', 'Invalid element class specified');
    assert(typeof ElementClass.tag === 'string', 'Element class must have a tag');
    assert(!ElementClass.extends || (typeof ElementClass.extends === 'string'), `The 'extends' property of the element class, if specified, must be a string`);
  }

  const tag = ElementClass.tag;
  const ext = ElementClass.extends;

  if (process.env.NODE_ENV === 'development') {
    if (ext) {
      debug(`Registering custom element with tag <${tag}> that extends <${ext}>`);
    }
    else {
      debug(`Registering custom element with tag <${tag}>`);
    }
  }

  customElements.define(tag, ElementClass, ext ? { extends: ext } : undefined);

  return customElements.get(tag);
}

export default register;
