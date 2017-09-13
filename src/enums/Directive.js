// © Andrew Wei

'use strict';

/**
 * Enum for custom DOM directives/attributes.
 *
 * @readonly
 * @enum {string}
 * @alias module:meno~enums.Directive
 */
const Directive = {
  /**
   * Custom element tag.
   */
  IS: 'is',

  /**
   * Instance name.
   */
  NAME: 'name',
  
  /**
   * Use this directive to map any property from the DOM to the controller.
   */
  DATA: 'data-'
};

export default Directive;
