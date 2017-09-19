// © Andrew Wei

'use strict';

import getElementRegistry from 'dom/getElementRegistry';

if (process.env.NODE_ENV === 'development') {
  var debug = require('debug')('meno');
  var assert = require('assert');
  var assertType = require('debug/assertType');
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
function register(tagOrClass, options) {
  if (process.env.NODE_ENV === 'development') {
    assertType(tagOrClass, ['string', Function], false, 'Invalid tag or class specified');
  }

  let tag;
  let o = {};

  if (tagOrClass instanceof Function) {
    tag = tagOrClass.tag;
    o = {
      prototype: tagOrClass.prototype,
      extends: tagOrClass.extends
    };
  }
  else {
    if (process.env.NODE_ENV === 'development') {
      assertType(options, ['object', 'function'], false, `Second param must be a class or an object literal containing at least the 'prototype' key`);
    }

    tag = tagOrClass;

    if (typeof options === 'object') {
      if (process.env.NODE_ENV === 'development') {
        assertType(options['prototype'], 'function', true, 'Invalid prototype class provided: ' + options['prototype']);
        assertType(options['class'], 'function', true, 'Invalid class provided: ' + options['class']);
        assert(!options['extends'] || typeof options['extends'] ===  'string', true, 'Invalid value specified for options.extends: ' + options['extends']);
      }
    }

    if (typeof options === 'function') {
      o = options
    }
    else {
      if (options['class']) {
        o['prototype'] = options['class'].prototype;
      }
      else if (options['prototype']) {
        o['prototype'] = options['prototype'];
      }

      if (options['extends']) o['extends'] = options['extends'];
    }
  }

  if (tag.indexOf('-') < 0) tag += '-element';
  tag = tag.toLowerCase();

  if (!getElementRegistry()[tag]) {
    if (process.env.NODE_ENV === 'development') {
      debug(`[register] Registering tag <${tag}> with constructor ${o.prototype.constructor.name}`);
    }

    getElementRegistry()[tag] = document.registerElement(tag, o);
  }

  return getElementRegistry()[tag];
}

export default register;
