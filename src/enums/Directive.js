// © Andrew Wei

'use strict';

import hasOwnValue from 'helpers/hasOwnValue';

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
  DATA: 'data:',

  /**
   * Use this directive as an attribute prefix to map any attribute to the 
   * event registry of the custom element.
   */
  EVENT: 'on:',

  /**
   * Gets the camel-cased property name from the kebab-cased attribute name.
   * 
   * @param {string} attributeName - The kebab-cased attribute name.
   * 
   * @return {string} The camel-cased property name.
   */
  getDataPropertyName(attributeName) {
    const regex = new RegExp('^' + Directive.DATA, 'i');
    
    if (hasOwnValue(Directive, attributeName) || !regex.test(attributeName)) return null;

    // Generate camel case property name from the attribute.
    let propertyName = attributeName.replace(regex, '').replace(/-([a-z])/g, (g) => (g[1].toUpperCase()));

    return propertyName;
  },

  /**
   * Gets the kebab-cased attribute name from the camel-cased property name.
   * 
   * @param {string} propertyName - The camel-cased property name.
   * 
   * @return {string} The kebab-cased attribute name.
   */
  getDataAttributeName(propertyName) {
    const attributeName = Directive.DATA + propertyName.replace(/([A-Z])/g, ($1) => ('-'+$1.toLowerCase()));
    if (!attributeName || hasOwnValue(Directive, attributeName)) return null;
    return attributeName;
  }
};

export default Directive;
