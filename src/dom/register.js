// © Andrew Wei

if (process.env.NODE_ENV === 'development') {
  var debug = require('debug')('meno:register');
  var assert = require('assert');
}

/**
 * Wraps the native `window.customElements.define` and registers a custom
 * element with the DOM while storing it in the registry.
 *
 * @param {Class} CustomElementClass - The Element class to register.
 *
 * @return {Class} The registered class.
 *
 * @see window.customElements.define
 *
 * @alias module:meno~dom.register
 */
function register(CustomElementClass) {
  if (process.env.NODE_ENV === 'development') {
    assert(typeof CustomElementClass === 'function', 'Invalid element class specified');
    assert(typeof CustomElementClass.tag === 'string', 'Element class must have a tag');
    assert(!CustomElementClass.extends || (typeof CustomElementClass.extends === 'string'), 'The \'extends\' property of the element class, if specified, must be a string');
  }

  const tag = CustomElementClass.tag;
  const ext = CustomElementClass.extends;

  if (process.env.NODE_ENV === 'development') {
    if (ext) {
      debug(`Registering custom element with tag <${tag}> that extends <${ext}>`);
    }
    else {
      debug(`Registering custom element with tag <${tag}>`);
    }
  }

  customElements.define(tag, CustomElementClass, ext ? { extends: ext } : undefined);

  return customElements.get(tag);
}

export default register;
