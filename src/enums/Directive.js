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
   * Use this directive as an attribute prefix to map any attribute to the 
   * data registry of the custom element.
   */
  DATA: 'data-',

  /**
   * Use this directive as an attribute prefix to map any attribute to the 
   * event registry of the custom element.
   */
  EVENT: 'on-'
};

export default Directive;
