// © Andrew Wei

'use strict';

import ElementUpdateDelegate from 'core/ElementUpdateDelegate';
import getChild from 'dom/getChild';
import hasChild from 'dom/hasChild';
import getAttribute from 'dom/getAttribute';
import getStyle from 'dom/getStyle';
import setStyle from 'dom/setStyle';
import register from 'dom/register';
import patch from 'vdom/patch';
import Directive from 'enums/Directive';
import DirtyType from 'enums/DirtyType';
import NodeState from 'enums/NodeState';
import EventQueue from 'events/EventQueue';
import getDirectCustomChildren from 'dom/getDirectCustomChildren';
import isCustomElement from 'dom/isCustomElement';
import hasOwnValue from 'helpers/hasOwnValue';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
  var assertType = require('debug/assertType');
  var debug = require('debug')('meno:Element');
}

/**
 * @class
 *
 * Returns a custom Element constructor with extended features. Specify the 
 * `base` Element class to inherit from (defaults to HTMLElement) and provide
 * the HTML `tag` to extend from.
 * 
 * @param {string|Function} [base=HTMLElement] - Base Node constructor for the
 *                                               returned constructor to inherit
 *                                               from. If this param is a 
 *                                               string, it will be used as the
 *                                               `tag` param instead, hence
 *                                               leaving the base constructor as
 *                                               HTMLElement.
 * @param {string} [tag] - The HTML tag to extend from. This follows the W3C 
 *                         custom element specs. Defaults to `div` if a base
 *                         is specified and this is left unefined.
 * 
 * @return {Node} - Constructor for an Element that inherits the specified base
 *                  constructor.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes}
 *
 * @alias module:meno~core.Element
 */
const Element = (base, tag) => (class extends (typeof base !== 'string' && base || HTMLElement) {
  /**
   * Gets the tag name of this Element instance. This method is meant to be
   * overridden by sub-classes because this class merely provides the foundation
   * functionality of a custom element, hence this class does not register
   * directly with the element registry. This tag name is used by
   * `document.registerElement()`.
   *
   * @return {string} The tag name.
   * 
   * @alias module:meno~core.Element.tag
   */
  static get tag() { return (typeof base === 'string') && base || tag || undefined; }

  /**
   * Gets the existing native element which this custom element extends. This
   * value is used in the `options` for `document.registerElement()`.
   *
   * @return {string} The tag of the native element.
   * 
   * @alias module:meno~core.Element.extends
   */
  static get extends() { return null; }

  /**
   * Creates a new DOM element from this Element class.
   *
   * @return {Node}
   * 
   * @alias module:meno~core.Element.factory
   */
  static factory() { return new (register(this))(); }

  /**
   * Override this method to define the responsive behavior of this element.
   * This method should return an object, where each key is a supported event
   * type and each value can either be a number representing the refresh delay
   * or an object literal with `delay` and/or `conductor`, indicating the 
   * refresh delay and element to respond to, respectively.
   * 
   * @type {Object}
   * 
   * @alias module:meno~core.Element#responsiveness
   * 
   * @see ElementUpdateDelegate#initResponsiveness
   */
  get responsiveness() { return {}; }

  /**
   * Instance name of this Element instance. Once set, it cannot be changed.
   *
   * @type {string}
   * 
   * @alias module:meno~core.Element#name
   */
  get name() {
    let s = this.getAttribute(Directive.NAME);
    if (!s || s === '') return null;
    return s;
  }
  set name(val) {
    // Once set, name cannot change.
    if (!this.name) super.setAttribute(Directive.NAME, val);
  }

  /**
   * Current node state of this Element instance.
   *
   * @type {NodeState}
   * 
   * @alias module:meno~core.Element#nodeState
   */
  get nodeState() { return this.get('nodeState', NodeState.IDLE); }

  /**
   * Indicates whether this Element instance is disabled.
   *
   * @type {boolean}
   * 
   * @alias module:meno~core.Element#disabled
   */
  get disabled() { return this.hasAttribute('disabled') ? this.getAttribute('disabled') : false; }
  set disabled(val) { this.setAttribute('disabled', (value ? true : false)); }

  /**
   * Indiciates whether this Element is invisible.
   * 
   * @type {boolean}
   * 
   * @alias module:meno~core.Element#invisible
   */
  get invisible() { return this.get('invisible', false); }
  set invisible(val) {
    if (this.nodeState === NodeState.INITIALIZED) {
      if (value) {
        this.setStyle('visibility', 'hidden');
      }
      else if (this.getStyle('visibility') === 'hidden') {
        this.setStyle('visibility', null);
      }
    }

    this.set('invisible', val);
  }

  /**
   * Opacity of this Element instance.
   *
   * @type {number}
   * 
   * @alias module:meno~core.Element#opacity
   */
  get opacity() { return this.getStyle('opacity', true); }
  set opacity(val) { this.setStyle('opacity', val); }

  /**
   * The VNode template of this element.
   *
   * @return {VNode} The VNode representing this element's DOM tree.
   * 
   * @alias module:meno~core.Element#template
   */
  get template() { return null; }

  /** 
   * Lifecycle callback invoked whenever this element is inserted into the DOM.
   * 
   * @inheritdoc 
   * @ignore
   */
  connectedCallback() {
    if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Attached to DOM.`);

    // Create object to hold all custom properties.
    this.__private__ = {};

    // This registry is for bookkeeping registered event listeners for child 
    // nodes with custom event directives.
    this.__private__.eventRegistry = {};

    // This registry is for bookkeeping external event listeners added to this 
    // element instance. This is for auto garbage cleaning listeners when this
    // element instance is removed from DOM.
    this.__private__.listenerRegistry = {};

    // This delegate object is for managing dirty updates.
    this.__private__.updateDelegate = new ElementUpdateDelegate(this);

    // This property is for storing all data.
    this.data = {};
    
    // Check if this Element has default data.
    const defaults = this.defaults();

    if (defaults) {
      // Go through each key/value pair and add it to this element's data.
      for (let key in defaults) {
        let descriptor = defaults[key];
        let value = undefined;
        let options = {};

        // Default data can be expressed in object literals. This allows for
        // additional config options.
        if (typeof descriptor === 'object' && descriptor.hasOwnProperty('value')) {
            value = descriptor.value;
            options = descriptor;
            delete options.value;
        }
        else {
          value = descriptor;
        }

        // All default data should affect rendering by default unless otherwise specified.
        if (typeof options.renderOnChange !== 'boolean') options.renderOnChange = true;

        this.__set_data__(key, value, options);

        if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Registered default data "${key}"`);
      }
    }

    // Make element invisible until its first update.
    this.setStyle('visibility', 'hidden');

    // Scan for internal DOM element attributes prefixed with Directive.DATA
    // and generate data properties from them.
    let attributes = this.attributes;
    let nAttributes = attributes.length;
    let regex = new RegExp('^' + Directive.DATA, 'i');

    for (let i = 0; i < nAttributes; i++) {
      let attribute = attributes[i];
      if (hasOwnValue(Directive, attribute.name) || !regex.test(attribute.name)) continue;
      // Generate camel case property name from the attribute.
      let propertyName = attribute.name.replace(regex, '').replace(/-([a-z])/g, (g) => (g[1].toUpperCase()));
      this.__set_data__(propertyName, this.getAttribute(attribute.name), { attributed: true });
      if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Registered data "${propertyName}" from attribute.`);
    }

    this.__render__();

    // Wait for children to initialize before initializing this element.
    this.__awaitInit__();
  }

  /** 
   * Lifecycle callback invoked whenever this element is removed from the DOM.
   * 
   * @inheritdoc 
   * @ignore
   */
  disconnectedCallback() {
    if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Removed from DOM.`);

    this.__destroy__();
    this.removeAllEventListeners();
    this.__private__.updateDelegate.destroy();
    this.__setNodeState__(NodeState.DESTROYED);
    // delete this.__private__;
  }

  /**
   * Lifecycle callback invoked whenever an attribute is added, removed or
   * updated.
   * 
   * @inheritdoc
   * @ignore
   */
  attributeChangedCallback(attrName, oldVal, newVal) {
    // if (process.env.NODE_ENV === 'development') {
    //   debug(`<${this.constructor.name}> attributeChangedCallback(${attrName}, ${oldVal}, ${newVal})`);
    // }
  }

  /**
   * Define default data here. This method returns an object, where each 
   * key/value pair represents a data in this element. The key is the name of
   * the data and the value is the default/initial value. You can express the
   * value as an object to provide additional configuration for Element#__set_data__.
   * In this case, the value key of the object is the initial value. When the
   * initial value is a function, this data is inferred as computed data, hence
   * there are no setters.
   * 
   * @return {Object} Default data.
   */
  defaults() {
    return null;
  }

  /**
   * Lifecycle hook: This method is invoked after this element is
   * added to the DOM, BEFORE the initial render starts, and RIGHT BEFORE 
   * the node state changes to NodeState.INITIALIZED. This is a good place to 
   * perform initial set up for this element. Note that if you want to set up 
   * the children of this element, there is a better hook for that. See 
   * Element#render. At this point, the children may not be rendered yet.
   * 
   * @alias module:meno~core.Element#init
   */
  init() {}

  /**
   * Lifecycle hook: This method is invoked right after this element is removed
   * from the DOM. This is a good place to clean things up.
   * 
   * @alias module:meno~core.Element#destroy
   */
  destroy() {}

  /**
   * Lifecycle hook: This method is invoked right after every render. On the
   * initial render, this hook is fired before Element#init. This is a good 
   * place to set up new children on every render.
   * 
   * @alias module:meno~core.Element#render
   */
  render() {}

  /**
   * Lifecycle hook: This method is invoked whenever a dirty update occurs. When
   * this element is first added to the DOM, this hook is invoked BEFORE
   * Element#init, AFTER Element#render.
   * 
   * @alias module:meno~core.Element#update
   */
  update() {}

  /**
   * Shorthand for Element#getChild.
   */
  $() { return this.getChild.apply(this, arguments); }

  /** 
   * @see module:meno~dom.getChild 
   * @alias module:meno~core.Element#getChild
   */
  getChild(name, recursive) { return getChild(this, name, recursive); }

  /** 
   * @see module:meno~dom.hasChild 
   * @alias module:meno~core.Element#hasChild
   */
  hasChild(child) { return hasChild(child, this); }

  /** 
   * @inheritdoc 
   * @ignore
   */
  getAttribute(name) {
    let value = super.getAttribute(name);
    if (value === '') return true;
    if (value === undefined || value === null) return null;
    try {
      return JSON.parse(value);
    }
    catch (err) {
      return value;
    }
  }

  /** 
   * @inheritdoc 
   * @ignore
   */
  setAttribute(name, value) {
    switch (name) {
      case Directive.NAME:
        this.name = value;
        break;
      default:
        if (value === undefined || value === null || value === false)
          this.removeAttribute(name);
        else if (value === true)
          super.setAttribute(name, '');
        else
          super.setAttribute(name, value);
        if (name === 'disabled')
          this.setDirty(DirtyType.STATE);
    }
  }

  /** 
   * @see module:meno~dom.getStyle 
   * @alias module:meno~core.Element#getStyle
   */
  getStyle(key, isComputed, isolateUnits) { return getStyle(this, key, isComputed, isolateUnits); }

  /** 
   * @see module:meno~dom.setStyle 
   * @alias module:meno~core.Element#setStyle
   */
  setStyle(key, value) { return setStyle(this, key, value); }

  /** 
   * @inheritdoc 
   * @ignore
   */
  addEventListener() {
    let event = arguments[0];
    let listener = arguments[1];
    let useCapture = arguments[2] || false;

    if (!this.__private__.listenerRegistry[event]) {
      this.__private__.listenerRegistry[event] = [];
    }

    let m = this.__private__.listenerRegistry[event];
    let n = m.length;
    let b = true;

    if (event === 'clickoutside') {
      let l = listener;
      listener = function(event) {
        if ((event.target !== this) && !this.hasChild(event.target)) {
          l(event);
        }
      }.bind(this);
    }

    for (let i = 0; i < n; i++) {
      let e = m[i];

      if (e.listener === listener) {
        b = false;
        break;
      }
    }

    if (b) {
      m.push({
        listener: listener,
        useCapture: useCapture
      });
    }

    if (event === 'clickoutside') {
      window.addEventListener('click', listener, useCapture);
    }
    else {
      super.addEventListener.apply(this, arguments);
    }
  }

  /** 
   * @see module:meno~core.Element#addEventListener 
   * @alias module:meno~core.Element#on
   */
  on() { this.addEventListener.apply(this, arguments); }

  /**
   * Determines if a particular listener (or any listener in the specified
   * event) exist in this Element instance.
   *
   * @param {string} event - Event name.
   * @param {Function} listener - Listener function.
   *
   * @return {boolean}
   * 
   * @alias module:meno~core.Element#hasEventListener
   */
  hasEventListener(event, listener) {
    if (!this.__private__.listenerRegistry) return false;
    if (!this.__private__.listenerRegistry[event]) return false;

    if (listener) {
      let m = this.__private__.listenerRegistry[event];
      let n = m.length;

      for (let i = 0; i < n; i++) {
        let e = m[i];

        if (e.listener === listener) return true;
      }

      return false;
    }
    else {
      return true;
    }
  }

  /** 
   * @inheritdoc 
   * @ignore
   */
  removeEventListener() {
    let event = arguments[0];
    let listener = arguments[1];
    let useCapture = arguments[2] || false;

    if (this.__private__.listenerRegistry && this.__private__.listenerRegistry[event]) {
      let m = this.__private__.listenerRegistry[event];
      let n = m.length;
      let s = -1;

      if (listener) {
        for (let i = 0; i < n; i++) {
          let e = m[i];

          if (e.listener === listener) {
            s = i;
            break;
          }
        }

        if (s > -1) {
          m.splice(s, 1);

          if (m.length === 0) {
            this.__private__.listenerRegistry[event] = null;
            delete this.__private__.listenerRegistry[event];
          }
        }
      }
      else {
        while (this.__private__.listenerRegistry[event] !== undefined) {
          this.removeEventListener(event, this.__private__.listenerRegistry[event][0].listener, this.__private__.listenerRegistry[event][0].useCapture);
        }
      }
    }

    if (listener) {
      if (window && event === 'clickoutside') {
        window.removeEventListener('click', listener, useCapture);
      }
      else {
        super.removeEventListener.apply(this, arguments);
      }
    }
  }

  /**
   * Removes all cached event listeners from this Element instance.
   * 
   * @alias module:meno~core.Element#removeAllEventListeners
   */
  removeAllEventListeners() {
    if (this.__private__.listenerRegistry) {
      for (let event in this.__private__.listenerRegistry) {
        this.removeEventListener(event);
      }
    }
  }

  /** 
   * @see ElementUpdateDelegate#isDirty 
   * @alias module:meno~core.Element#isDirty
   */
  isDirty() { return this.__private__.updateDelegate.isDirty.apply(this.__private__.updateDelegate, arguments); }

  /** 
   * @see ElementUpdateDelegate#setDirty 
   * @alias module:meno~core.Element#setDirty
   */
  setDirty() { return this.__private__.updateDelegate.setDirty.apply(this.__private__.updateDelegate, arguments); }

  /**
   * Shorthand for creating/accessing private properties.
   *
   * @param {string} propertyName - Name of private property.
   * @param {*} [defaultInitializer] - Optional default value/initializer to set
   *                                   the private property to if it doesn't
   *                                   exist.
   *
   * @return {*} Value of private property.
   * 
   * @alias module:meno~core.Element#get
   */
  get(propertyName, defaultInitializer) {
    if (process.env.NODE_ENV === 'development') {
      assertType(propertyName, 'string', false);
    }
    if (!this.__private__) this.__private__ = {};
    if (this.__private__[propertyName] === undefined) this.__private__[propertyName] = (typeof defaultInitializer === 'function') ? defaultInitializer() : defaultInitializer;
    return this.__private__[propertyName];
  }

  /**
   * Shorthand for modifying private properties.
   *
   * @param {string} propertyName - Name of private property.
   * @param {*} value - Value of private property to be set.
   * 
   * @alias module:meno~core.Element#set
   */
  set(propertyName, value) {
    if (process.env.NODE_ENV === 'development') {
      assertType(propertyName, 'string', false);
    }
    if (!this.__private__) this.__private__ = {};
    this.__private__[propertyName] = value;
  }

  /**
   * Method invoked when this element is added to the DOM.
   * 
   * @private 
   */
  __init__() {
    // Initialize responsive behaviors.
    const responsiveness = this.responsiveness;

    if (process.env.NODE_ENV === 'development') {
      assertType(responsiveness, Object, true, `The static property 'responsiveness' must be an Object`);
    }

    if (responsiveness) {
      for (let key in responsiveness) {
        let value = responsiveness[key];

        if (typeof value === 'number') {
          this.__private__.updateDelegate.initResponsiveness.apply(this.__private__.updateDelegate, [value, key]);
        }
        else if (typeof value === 'object') {
          let args = [];
          if (value.conductor) args.push(value.conductor);
          if (value.delay) args.push(value.delay);
          args.push(key);
          this.__private__.updateDelegate.initResponsiveness.apply(this.__private__.updateDelegate, args);
        }
        else {
          this.__private__.updateDelegate.initResponsiveness.apply(this.__private__.updateDelegate, [key]);
        }
      }
    }

    if (this.init) this.init();

    if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Initialized.`);
    
    // Update the node state to `initialized`.
    this.__setNodeState__(NodeState.INITIALIZED);

    // Invoke update delegate.
    this.__private__.updateDelegate.init();
    
    // Now that the initial update is complete, unhide the element.
    this.setStyle('visibility', this.invisible ? 'hidden' : null);
  }

  /**
   * Method invoked every time this element is removed from the DOM.
   * 
   * @private
   */
  __destroy__() {
    if (this.__private__.eventQueue) this.__private__.eventQueue.kill();
    if (this.destroy) this.destroy();
    if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Node destroyed.`);
  }

  /**
   * Renders the template of this element instance.
   * 
   * @private
   */
  __render__() {
    // If this element doesn't use a vtree, skip it.
    const vtree = this.template;

    if (!vtree) {
      this.__sync_child_events__();
      return;
    }

    if (!this.__private__.vtree) {
      if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Rendering element for the first time.`);
      
      while (this.lastChild) {
        this.removeChild(this.lastChild);
      }
    }
    else {
      if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Patching element with new vtree.`);
    }

    this.__private__.vtree = patch(this, vtree, this.__private__.vtree);

    if (this.render) this.render();
  }

  /**
   * Waits for all custom children to be initialized before initializing this
   * element.
   * 
   * @private
   */
  __awaitInit__() {
    if (this.nodeState === NodeState.INITIALIZED) return;

    const customChildren = getDirectCustomChildren(this);
    const n = customChildren.length;

    if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Waiting for ${n} custom child node(s) to initialize.`);
    
    // Reset internal event queue.
    if (this.__private__.eventQueue) {
      this.__private__.eventQueue.removeAllEventListeners();
      this.__private__.eventQueue.kill();
    }

    if (n > 0) {
      this.__private__.eventQueue = new EventQueue();

      for (let i = 0; i < n; i++) {
        const child = customChildren[i];
        if ((child.nodeState === undefined) || (child.nodeState < NodeState.INITIALIZED)) {
          this.__private__.eventQueue.enqueue(child, 'nodeinitialize');
        }
      }
      
      this.__private__.eventQueue.addEventListener('complete', this.__init__.bind(this));
      this.__private__.eventQueue.start();
    }
    else {
      this.__init__();
    }
  }

  /**
   * Sets the Element's node state.
   *
   * @param {NodeState} nodeState - Node state.
   * 
   * @event 'nodeinitialize' - Dispatched when node state is set to
   *                           NodeState.INITIALIZED.
   * @event 'nodeupdate' - Dispatched when node state is set to NodeState.UPDATE.
   * @event 'nodedestroy' - Dispatched when node state is set to
   *                        NodeState.DESTROYED.
   * @event 'nodestate' - Dispatched whenever the note state is changed.
   *
   * @private
   */
  __setNodeState__(nodeState) {
    if (this.__private__.nodeState === nodeState) return;
    let oldVal = this.__private__.nodeState;
    this.__private__.nodeState = nodeState;

    if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Node state changed to "${NodeState.toString(nodeState)}".`);

    if (nodeState === NodeState.INITIALIZED) {
      this.dispatchEvent(new Event('nodeinitialize'));
    }
    else if (nodeState === NodeState.DESTROYED) {
      this.dispatchEvent(new Event('nodedestroy'));
    }

    this.dispatchEvent(new Event('nodestate'));
  }

  /**
   * Defines or updates a data for this element.
   *
   * @param {string} key - Name of the data to be defined or updated.
   * @param {*} value - The value to update or to set as the initial value.
   * @param {Object} options - An object literal that defines the behavior of 
   *                           this data. This object literal inherits that of 
   *                           the descriptor param in Object#defineProperty.
   * @param {boolean} [options.unique=true] - Specifies that the on change hooks
   *                                          are only triggered if the new 
   *                                          value is different from the old 
   *                                          value.
   * @param {DirtyType} [options.dirtyType=DirtyType.DATA] - Specifies the flag 
   *                                                         to mark as dirty 
   *                                                         when a new value is 
   *                                                         set.
   * @param {String} [options.eventType] - Specifies the event type to dispatch 
   *                                       whenever a new value is set.
   * @param {boolean} [options.renderOnChange=true] - Specifies whether this
   *                                                  element rerenders when a 
   *                                                  new value is set.
   * @param {boolean} [options.attributed] - Specifies whether a corresponding 
   *                                         DOM attribute will update whenever 
   *                                         a new value is set.
   * @param {Function} [options.onChange] - Method invoked when the data changes.
   *
   * @private
   */
  __set_data__(key, value, options) {
    // If this element already has this data defined, simply update its value.
    if (this.data.hasOwnProperty(key)) {
      this.data[key] = value;
      return;
    }

    // Create the internal data dictionary.
    if (this.data === undefined) this.data = {};
    if (this.data.__private__ === undefined) this.data.__private__ = {};

    if (!options) options = {};

    if (process.env.NODE_ENV === 'development') {
      assertType(options.unique, 'boolean', true, 'Optional unique key in options must be a boolean');
      assertType(options.dirtyType, 'number', true, 'Optional dirty type must be of DirtyType enum (number)');
      assertType(options.eventType, 'string', true, 'Optional event type must be a string');
      assertType(options.renderOnChange, 'boolean', true, 'Optional renderOnChange must be a boolean');
      assertType(options.attributed, 'boolean', true, 'Optional attributed must be a boolean');
      assertType(options.onChange, 'function', true, 'Optional change handler must be a function');
    }
  
    const dirtyType = options.dirtyType === undefined ? DirtyType.DATA : options.dirtyType;
    const renderOnChange = typeof options.renderOnChange === 'boolean' ? options.renderOnChange : true;
    const attributed = typeof options.attributed === 'boolean' ? options.attributed : false;
    const attributeName = Directive.DATA + key.replace(/([A-Z])/g, ($1) => ('-'+$1.toLowerCase()));
    const eventType = options.eventType;
    const unique = (typeof unique === 'boolean') ? options.unique : true;
  
    if (process.env.NODE_ENV === 'development') {
      assert(!attributeName || !hasOwnValue(Directive, attributeName), 'Attribute \'' + attributeName + '\' is reserved');
    }
  
    // Set the default value if its is not a computed value.
    if (value !== undefined && typeof value !== 'function') {
      Object.defineProperty(this.data.__private__, key, { value: value, writable: true });
    }
  
    let descriptor = {};
  
    descriptor.get = (typeof value === 'function') ? value : () => (this.data.__private__[key]);

    if (typeof value !== 'function') {
      descriptor.set = (val) => {
        const oldVal = this.data.__private__[key];

        // Early exit if new value is the same as old value, and that unique
        // values are required.
        if (unique && (oldVal === val)) return;
  
        if (oldVal === undefined) {
          Object.defineProperty(this.data.__private__, key, { value: val, writable: true });
        }
        else {
          this.data.__private__[key] = val;
        }
  
        // If change callback is specified, trigger it.
        if (options.onChange !== undefined) options.onChange(oldVal, val);

        // If this data is attributed, update the attribute.
        if (attributed === true) this.setAttribute(attributeName, val);

        // If a dirty flag is associated with this data, mark it as dirty.
        if (dirtyType !== undefined) {
          this.setDirty(dirtyType);
        }

        // If this data is set to render on change, do so.
        if (options.renderOnChange) {
          this.__render__();
        }
  
        // If there is an event associated with this data, dispatch it.
        if (eventType) {
          const event = new CustomEvent(eventType, {
            detail: {
              property: key,
              oldValue: oldVal,
              newValue: val
            }
          });
  
          this.dispatchEvent(event);
        }
      }
    }
  
    Object.defineProperty(this.data, key, descriptor);

    // Trigger hooks when this method is first called.
    if (typeof value !== 'function') {
      if (value !== undefined && attributed === true) {
        this.setAttribute(attributeName, value);
      }

      if (options.onChange && value !== undefined) {
        options.onChange(undefined, value);
      }

      if (value !== undefined && dirtyType !== undefined && this.nodeState === NodeState.INITIALIZED) {
        this.setDirty(dirtyType);
        this.__render__();
      }
    }
  }

  /**
   * Automatically sync event listeners with child events specified in their
   * custom event attributes.
   * 
   * @param {Node} [parent] - The parent node to listen for child events.
   * 
   * @private
   */
  __sync_child_events__(parent=this) {
    if (parent === this) {
      if (process.env.NODE_ENV === 'development')  debug(`<${this.constructor.name}> Syncing child events...`);
      this.__unregister_child_event__();
    }

    const n = parent.childNodes.length;
    
    for (let i = 0; i < n; i++) {
      const child = parent.childNodes[i];

      this.__register_all_child_events__(child);
    }
  }

  /**
   * Registers all events with a child node.
   * 
   * @param {Node} child - The child node dispatching the events.
   * 
   * @private
   */
  __register_all_child_events__(child) {
    if (process.env.NODE_ENV === 'development') {
      assert(child instanceof Node, `Invalid child specified`);
    }

    const regex = new RegExp('^' + Directive.EVENT, 'i');
    
    if (!child.attributes) return;
    
    for (let i = 0; i < child.attributes.length; i++) {
      const attribute = child.attributes[i];
      if (!regex.test(attribute.name)) continue;
      const eventType = attribute.name.replace(Directive.EVENT, '');
      const handlerName = getAttribute(child, attribute.name);
      this.__register_child_event__(child, eventType, handlerName);
    }

    if (!isCustomElement(child)) {
      this.__sync_child_events__(child);
    }
  }

  /**
   * Registers an event with a child node.
   * 
   * @param {Node} child - The child node dispatching the event.
   * @param {string} eventType - Name of the event to listen to.
   * @param {string} handlerName - Name of the listener handler.
   * 
   * @private
   */
  __register_child_event__(child, eventType, handlerName) {
    if (process.env.NODE_ENV === 'development') {
      assert(child instanceof Node, `Invalid child specified`);
      assert(typeof eventType === 'string', `Invalid event type specified`);
      assert(typeof handlerName === 'string', `Invalid handler name specified`);
    }

    // If this element doesn't have the handler name defined, early exit.
    if (!this[handlerName]) {
      if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Failed to register for event "${eventType}", this element does not have a method named "${handlerName}"`);
      return;
    }
    
    // If the same event is already registered, early exit.
    let entries = this.__private__.eventRegistry[eventType] || [];
    let n = entries.length;
    
    for (let i = 0; i < n; i++) {
      const entry = entries[i];
      
      if (entry.dispatcher === child) {
        if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Failed to register for event "${eventType}" with handler name "${handlerName}". The same event for this child is already registered.`);
        return;
      }
    }
    
    // Proceed to registering for the child event.
    const handler = function(event) { this[handlerName](event); }.bind(this);
  
    entries.push({
      dispatcher: child,
      handler: handler
    });
  
    child.addEventListener(eventType, handler);

    this.__private__.eventRegistry[eventType] = entries;

    if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Registered event "${eventType}" with handler name "${handlerName}" for child:`, child);
  }


  /**
   * Unregisters an event or multiple events from a child (or all children).
   * 
   * @param {Node} [child] - The child that dispatched the event. If unspecified,
   *                         all child events will be unregistered from this
   *                         element, regardless of child nodes.
   * @param {string} [eventType] - The event type to unregister. If unspecified,
   *                               all event types for the given child node will
   *                               be unregistered.
   */
  __unregister_child_event__(child, eventType) {
    // If no child is specified, remove all events for all child nodes.
    if (!child) {
      for (let key in this.__private__.eventRegistry) {
        const entries = this.__private__.eventRegistry[key];
        const n = entries.length;

        for (let i = 0; i < n; i++) {
          const entry = entries[i];
          entry.dispatcher.removeEventListener(key, entry.handler);
        }
      }

      // Empty the registry when done.
      this.__private__.eventRegistry = {};

      if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Unregistered all child events.`);

      return;
    }

    // If no event type is specified, unregister all events for the specified
    // child.
    if (!eventType) {
      for (let key in this.__private__.eventRegistry) {
        const entries = this.__private__.eventRegistry[key];
        const n = entries.length;

        for (let i = 0; i < n; i++) {
          const entry = entries[i];

          if (entry.dispatcher === child) {
            entry.dispatcher.removeEventListener(key, entry.handler);
            entries.splice(i, 1);
            break;
          }
        }
      }

      if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Unregistered all events for child`, child);

      return;
    }
    else {
      const entries = this.__private__.eventRegistry[eventType];

      if (!entries) return;

      const n = entries.length;

      for (let i = 0; i < n; i++) {
        const entry = entries[i];
        
        if (entry.dispatcher === child) {
          entry.dispatcher.removeEventListener(eventType, entry.handler);
          entries.splice(i, 1);
          break;
        }
      }

      if (process.env.NODE_ENV === 'development') debug(`<${this.constructor.name}> Unregistered event "${eventType}" for child`, child);
    }
  }
});

export default Element;
