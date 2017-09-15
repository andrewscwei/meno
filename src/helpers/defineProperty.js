// © Andrew Wei

'use strict';

import setAttribute from '../dom/setAttribute';
import Directive from '../enums/Directive';
import NodeState from '../enums/NodeState';
import assert from '../helpers/assert';
import assertType from '../helpers/assertType';
import hasOwnValue from '../helpers/hasOwnValue';

/**
 * Defines a property in an element instance.
 *
 * @param {Node} element - Element instance to define the new property in.
 * @param {string} propertyName - Name of the property to be defined.
 * @param {Object} descriptor - An object literal that defines the behavior of
 *                              this new property. This object literal inherits
 *                              that of the descriptor param in
 *                              Object#defineProperty.
 * @param {boolean} [descriptor.unique=true] - Specifies that the modifier
 *                                             method will only invoke if the
 *                                             new value is different from the
 *                                             old value.
 * @param {DirtyType} [descriptor.dirtyType] - Specifies the DirtyType to flag
 *                                             whenever a new value is set.
 * @param {String} [descriptor.eventType] - Specifies the event type to dispatch 
 *                                          whenever a new value is set.
 * @param {boolean} [descriptor.attributed] - Specifies whether a corresponding 
 *                                            DOM attribute will update whenever 
 *                                            a new value is set.
 * @param {Function} [descriptor.onChange] - Method invoked when the property
 *                                           changes.
 * @param {Function|boolean} [descriptor.get] - Method invoked when the accessor
 *                                              method is called. This is a good
 *                                              place to manipulate the value
 *                                              before it is returned. If simply
 *                                              set to true, a generic accessor
 *                                              method will be used.
 * @param {Function|boolean} [descriptor.set] - Method invoked when the modifier
 *                                              method is called. This is a good
 *                                              place to manipulate the value
 *                                              before it is set. If simply set
 *                                              to true, a generic modifier
 *                                              method will be used.
 * @param {string} [scope] - Name of the instance property of the Element to
 *                           create the new property in. This property must be
 *                           enumerable.
 *
 * @alias module:meno~helpers.defineProperty
 */
function defineProperty(element, propertyName, descriptor, scope) {
  assert(element, 'Parameter \'element\' must be defined');
  assertType(descriptor, 'object', false, 'Parameter \'descriptor\' must be an object literal');
  assertType(descriptor.enumerable, 'boolean', true, 'Optional enumerable key in descriptor must be a boolean');
  assertType(descriptor.writable, 'boolean', true, 'Optional writable key in descriptor must be a boolean');
  assertType(descriptor.unique, 'boolean', true, 'Optional unique key in descriptor must be a boolean');
  assertType(descriptor.dirtyType, 'number', true, 'Optional dirty type must be of DirtyType enum (number)');
  assertType(descriptor.eventType, 'string', true, 'Optional event type must be a string');
  assertType(descriptor.attributed, 'boolean', true, 'Optional attributed must be a boolean');
  assertType(descriptor.onChange, 'function', true, 'Optional change handler must be a function');
  assertType(scope, 'string', true, 'Optional parameter \'scope\' must be a string');

  let dirtyType = descriptor.dirtyType;
  let defaultValue = descriptor.defaultValue;
  let attributed = descriptor.attributed;
  let attributeName = Directive.DATA+propertyName.replace(/([A-Z])/g, ($1) => ('-'+$1.toLowerCase()));
  let eventType = descriptor.eventType;
  let unique = descriptor.unique;

  assert(!attributeName || !hasOwnValue(Directive, attributeName), 'Attribute \'' + attributeName + '\' is reserved');

  if (unique === undefined) unique = true;

  if (scope === undefined) {
    scope = element;
  }
  else {
    assert(element.hasOwnProperty(scope), 'The specified Element instance does not have a property called \'' + scope + '\'');
    scope = element[scope];
  }

  if (defaultValue !== undefined) {
    scope.__private__ = scope.__private__ || {};
    Object.defineProperty(scope.__private__, propertyName, { value: defaultValue, writable: true });
  }

  let newDescriptor = {};

  if (descriptor.enumerable !== undefined) newDescriptor.enumerable = descriptor.enumerable;
  if (descriptor.value !== undefined) newDescriptor.value = descriptor.value;
  if (descriptor.writable !== undefined) newDescriptor.writable = descriptor.writable;

  if (descriptor.get) {
    newDescriptor.get = () => ((typeof descriptor.get === 'function') ? descriptor.get(scope.__private__[propertyName]) : scope.__private__[propertyName]);
  }

  if (descriptor.set) {
    newDescriptor.set = (val) => {
      let oldVal = scope.__private__[propertyName];

      if (typeof descriptor.set === 'function') val = descriptor.set(val);

      if (unique && (oldVal === val)) return;

      if (oldVal === undefined) {
        scope.__private__ = scope.__private__ || {};
        Object.defineProperty(scope.__private__, propertyName, { value: val, writable: true });
      }
      else {
        scope.__private__[propertyName] = val;
      }

      if (descriptor.onChange !== undefined) descriptor.onChange(oldVal, val);
      if (attributed === true) setAttribute(element, attributeName, val);
      if ((dirtyType !== undefined) && (element.setDirty)) element.setDirty(dirtyType);

      if (eventType !== undefined) {
        let event = new CustomEvent(eventType, {
          detail: {
            property: propertyName,
            oldValue: oldVal,
            newValue: val
          }
        });

        if (element.dispatchEvent)
          element.dispatchEvent(event);
      }
    };
  }

  Object.defineProperty(scope, propertyName, newDescriptor);

  if (defaultValue !== undefined && attributed === true) {
    setAttribute(element, attributeName, defaultValue);
  }

  if (descriptor.onChange !== undefined && defaultValue !== undefined) {
    descriptor.onChange(undefined, defaultValue);
  }

  if (defaultValue !== undefined && dirtyType !== undefined && element.nodeState === NodeState.INITIALIZED && element.setDirty) {
    element.setDirty(dirtyType);
  }
}

export default defineProperty;
