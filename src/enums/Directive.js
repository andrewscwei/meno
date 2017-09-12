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
  IS: 'is',
  
  /**
   * Use this directive for managing DOM element states.
   */
  STATE: 'state',

  /**
   * Use this directive for referencing global shared data.
   */
  REF: 'data-ref',

  /**
   * Use this directive to map any property from the DOM to the controller.
   */
  DATA: 'data-'
};

export default Directive;
