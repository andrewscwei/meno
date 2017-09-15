// © Andrew Wei

'use strict';

import ElementUpdateDelegate from './ElementUpdateDelegate';
import addChild from '../dom/addChild';
import getChild from '../dom/getChild';
import hasChild from '../dom/hasChild';
import addClass from '../dom/addClass';
import removeClass from '../dom/removeClass';
import hasClass from '../dom/hasClass';
import hasAttribute from '../dom/hasAttribute';
import getStyle from '../dom/getStyle';
import setStyle from '../dom/setStyle';
import hasStyle from '../dom/hasStyle';
import removeChild from '../dom/removeChild';
import getChildRegistry from '../dom/getChildRegistry';
import removeFromChildRegistry from '../dom/removeFromChildRegistry';
import createElement from '../dom/createElement';
import register from '../dom/register';
import sightread from '../dom/sightread';
import Directive from '../enums/Directive';
import DirtyType from '../enums/DirtyType';
import NodeState from '../enums/NodeState';
import EventQueue from '../events/EventQueue';
import assert from '../helpers/assert';
import assertType from '../helpers/assertType';
import defineProperty from '../helpers/defineProperty';
import getDirectCustomChildren from '../helpers/getDirectCustomChildren';
import hasOwnValue from '../helpers/hasOwnValue';

// import h from 'virtual-dom/h';
// import diff from 'virtual-dom/diff';
// import patch from 'virtual-dom/patch';
// import createElement from 'virtual-dom/create-element';

// const convertHTML = require('html-to-vdom')({
//   VNode: require('virtual-dom/vnode/vnode'),
//   VText: require('virtual-dom/vnode/vtext')
// });

const USE_VIRTUAL_DOM = false;
const USE_SHADOW_DOM = false;

/**
 * @class
 *
 * Returns a Node constructor that by default inherits HTMLElement. Specify the
 * `base` constructor and HTML `tag` to extend from in the params.
 * 
 * @param {string|Function} [base=HTMLElement] - Base Node constructor for the
 *                                               returned constructor to inherit
 *                                               from. If this param is a 
 *                                               string, it will be used as the
 *                                               `tag` param instead, hence
 *                                               leaving the base constructor as
 *                                               HTMLElement.
 * @param {string} [tag] - The name of the HTML tag for the returned Node
 *                         constructor. This follows the W3C custom element 
 *                         specs.
 * 
 * @return {Node} - Constructor for a Node that inherits the specified base
 *                  constructor and consisting of all Meno features.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes}
 *
 * @alias module:meno~ui.Element
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
   * @alias module:meno~ui.Element.tag
   */
  static get tag() { return (typeof base === 'string') && base || tag || undefined; }

  /**
   * Gets the existing native element which this custom element extends. This
   * value is used in the `options` for `document.registerElement()`.
   *
   * @return {string} The tag of the native element.
   * 
   * @alias module:meno~ui.Element.extends
   */
  static get extends() { return this.tag && 'div' || null; }

  /**
   * Creates a new DOM element from this Element class.
   *
   * @return {Node}
   * 
   * @alias module:meno~ui.Element.factory
   */
  static factory() { return new (register(this))(); }

  /**
   * Instance name of this Element instance. Once set, it cannot be changed.
   *
   * @type {string}
   * 
   * @alias module:meno~ui.Element#name
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
   * Opacity of this Element instance.
   *
   * @type {number}
   * 
   * @alias module:meno~ui.Element#opacity
   */
  get opacity() { return this.getStyle('opacity', true); }
  set opacity(val) { this.setStyle('opacity', val); }

  /** 
   * Lifecycle callback invoked whenever an instance of this element is created.
   * This does not mean the element is inserted into the DOM.
   * 
   * @inheritdoc 
   * @ignore
   */
  createdCallback() {
    console.log(`[${this.constructor.name}] createdCallback()`);

    // Define instance properties.
    this.__defineProperties__();

    // Scan for internal DOM element attributes prefixed with Directive.DATA
    // and generate data properties from them.
    let attributes = this.attributes;
    let nAtributes = attributes.length;
    let regex = new RegExp('^' + Directive.DATA, 'i');

    for (let i = 0; i < nAtributes; i++) {
      let attribute = attributes[i];

      if (hasOwnValue(Directive, attribute.name) || !regex.test(attribute.name)) continue;

      // Generate camel case property name from the attribute.
      let propertyName = attribute.name.replace(regex, '').replace(/-([a-z])/g, (g) => (g[1].toUpperCase()));
      this.setData(propertyName, this.getAttribute(attribute.name), { attributed: true });
    }

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

        this.setData(key, value, options);
      }
    }

    // Make element invisible until its first update.
    this.setStyle('visibility', 'hidden');
  }

  /** 
   * Lifecycle callback invoked whenever this element is inserted into the DOM.
   * 
   * @inheritdoc 
   * @ignore
   */
  attachedCallback() {
    console.log(`[${this.constructor.name}] attachedCallback()`);

    // Wait for children to initialize before initializing this element.
    this.__awaitInit__();
  }

  /** 
   * Lifecycle callback invoked whenever this element is removed from the DOM.
   * 
   * @inheritdoc 
   * @ignore
   */
  detachedCallback() {
    console.log(`[${this.constructor.name}] detachedCallback()`);

    this.__destroy__();
    this.removeAllEventListeners();
    this.updateDelegate.destroy();
    this.__setNodeState__(NodeState.DESTROYED);
  }

  /**
   * Lifecycle callback invoked whenever an attribute is added, removed or
   * updated.
   * 
   * @inheritdoc
   * @ignore
   */
  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log(`[${this.constructor.name}] attributeChangedCallback(${attrName}, ${oldVal}, ${newVal})`);
  }

  /**
   * Default data.
   * 
   * @return {Object} Seed data.
   */
  defaults() {
    return null;
  }

  /**
   * Lifecycle hook: This method is invoked after this element is
   * added to the DOM, AFTER the initial render is complete, and RIGHT BEFORE 
   * the node state changes to NodeState.INITIALIZED. This is a good place to 
   * perform initial set up for this element. Note that if you want to set up 
   * the children of this element, there is a better hook for that. See 
   * Element#render.
   * 
   * @alias module:meno~ui.Element#init
   */
  init() {}

  /**
   * Lifecycle hook: This method is invoked right after this element is removed
   * from the DOM. This is a good place to clean things up.
   * 
   * @alias module:meno~ui.Element#destroy
   */
  destroy() {}

  /**
   * Lifecycle hook: This method is invoked right after every render. On the
   * initial render, this hook is fired before Element#init. This is a good 
   * place to set up new children on every render.
   * 
   * @alias module:meno~ui.Element#render
   */
  render() {}

  /**
   * Lifecycle hook: This method is invoked whenever a dirty update occurs. When
   * this element is first added to the DOM, this hook is invoked BEFORE
   * Element#init, AFTER Element#render.
   * 
   * @alias module:meno~ui.Element#update
   */
  update() {}

  /** 
   * @see module:meno~ui.ElementUpdateDelegate#initResponsiveness 
   * @alias module:meno~ui.Element#respondsTo
   */
  respondsTo() { this.updateDelegate.initResponsiveness.apply(this.updateDelegate, arguments); }

  /** 
   * @see module:meno~dom.addChild 
   * @alias module:meno~ui.Element#addChild
   */
  addChild(child, name, prepend) { return addChild(this, child, name, prepend); }

  /** 
   * @see module:meno~dom.removeChild 
   * @alias module:meno~ui.Element#removeChild
   */
  removeChild(child) {
    if ((child instanceof Node) && (child.parentNode === this)) {
      removeFromChildRegistry(getChildRegistry(this), child);
      return super.removeChild(child);
    }
    else {
      return removeChild(this, child);
    }
  }

  /**
   * Removes all children from this element.
   * 
   * @alias module:meno~ui.Element#removeAllChildren
   * @todo Support shadow DOM.
   */
  removeAllChildren() {
    if (USE_SHADOW_DOM && this.shadowRoot) {
      try {
        while (this.shadowRoot.lastChild) this.shadowRoot.removeChild(this.shadowRoot.lastChild);
      }
      catch (err) {}
    }
    else {
      while (this.lastChild) {
        this.removeChild(this.lastChild);
      }
    }
  }

  /**
   * Shorthand for Element#getChild.
   */
  $() { return this.getChild.apply(this, arguments); }

  /** 
   * @see module:meno~dom.getChild 
   * @alias module:meno~ui.Element#getChild
   */
  getChild(name, recursive) { return getChild(this, name, recursive); }

  /** 
   * @see module:meno~dom.hasChild 
   * @alias module:meno~ui.Element#hasChild
   */
  hasChild(child) { return hasChild(child, this); }

  /** 
   * @see module:meno~dom.addClass 
   * @alias module:meno~ui.Element#addClass
   */
  addClass(className) { return addClass(this, className); }

  /** 
   * @see module:meno~dom.removeClass 
   * @alias module:meno~ui.Element#removeClass
   */
  removeClass(className) { return removeClass(this, className); }

  /** 
   * @see module:meno~dom.hasClass 
   * @alias module:meno~ui.Element#hasClass
   */
  hasClass(className) { return hasClass(this, className); }

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
   * @see module:meno~dom.hasAttribute 
   * @alias module:meno~ui.Element#hasAttribute
   */
  hasAttribute(name) { return hasAttribute(this, name); }

  /** 
   * @see module:meno~dom.getStyle 
   * @alias module:meno~ui.Element#getStyle
   */
  getStyle(key, isComputed, isolateUnits) { return getStyle(this, key, isComputed, isolateUnits); }

  /** 
   * @see module:meno~dom.setStyle 
   * @alias module:meno~ui.Element#setStyle
   */
  setStyle(key, value) { return setStyle(this, key, value); }

  /** 
   * @see module:meno~dom.hasStyle 
   * @alias module:meno~ui.Element#hasStyle
   */
  hasStyle(key) { return hasStyle(this, key); }

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
   * @see module:meno~ui.Element#addEventListener 
   * @alias module:meno~ui.Element#on
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
   * @alias module:meno~ui.Element#hasEventListener
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
   * @see module:meno~ui.Element#removeEventListener 
   * @alias module:meno~ui.Element#off
   */
  off() { this.removeEventListener.apply(this, arguments); }

  /**
   * Removes all cached event listeners from this Element instance.
   * 
   * @alias module:meno~ui.Element#removeAllEventListeners
   */
  removeAllEventListeners() {
    if (this.__private__.listenerRegistry) {
      for (let event in this.__private__.listenerRegistry) {
        this.removeEventListener(event);
      }
    }
  }

  /**
   * Gets the value of the data property with the specified name.
   *
   * @param {string} key - Name of the data property.
   *
   * @return {*} Value of the data property.
   * 
   * @alias module:meno~ui.Element#getData
   */
  getData(key) {
    return this.data[key];
  }

  /**
   * Checks to see if this Element instance has the data property of the
   * specified name.
   *
   * @param {string} key - Name of the data property.
   *
   * @return {boolean} True if data property exists, false othwerwise.
   * 
   * @alias module:meno~ui.Element#hasData
   */
  hasData(key) {
    return this.data.hasOwnProperty(key);
  }

  /**
   * Defines multiple data properties if the first argument is an object literal
   * (hence using its key/value pairs) or sets a single data property of the
   * specified name with the specified value. If the data property does not
   * exist, it will be newly defined.
   *
   * @param {string} key - Name of the data property if defining only one, or
   *                          an object literal containing key/value pairs to be
   *                          merged into this Element instance's data
   *                          properties.
   * @param {*} value - Value of the data property (if defining only one).
   * @param {Object} [options] - If defining only one data property, specifies 
   *                             the options for 
   *                             module:meno~helpers.defineProperty.
   * @param {boolean} [options.unique=true] - Specifies that the modifier method 
   *                                          will only invoke if the new value 
   *                                          is different from the old value.
   * @param {DirtyType} [options.renderOnChange] - Specifies whether the element
   *                                               should render whenever a new 
   *                                               value is set.
   * @param {String} [options.eventType] - Specifies the event type to dispatch 
   *                                       whenever a new value is set.
   * @param {boolean} [options.attributed] - Specifies whether a corresponding 
   *                                         DOM attribute will update whenever 
   *                                         a new value is set.
   * @param {Function} [options.onChange] - Method invoked when the value
   *                                        changes.
   * 
   * @alias module:meno~ui.Element#setData
   */
  setData(key, value, options) {
    if (typeof key !== 'string') return;

    if (this.hasData(key)) {
      this.data[key] = value;
    }
    else {
      if (!options) options = {};

      let opts = {
        defaultValue: value,
        dirtyType: DirtyType.DATA,
        get: true,
        set: true
      };

      if (typeof value === 'function') opts.set = false;
      if (typeof options.unique === 'boolean') opts.unique = options.unique;
      if (typeof options.renderOnChange === 'boolean') opts.dirtyType |= DirtyType.RENDER;
      if (typeof options.eventType === 'string') opts.eventType = options.eventType;
      if (typeof options.attributed === 'boolean') opts.attributed = options.attributed;
      if (typeof options.onChange === 'function') opts.onChange = options.onChange;

      defineProperty(this, key, opts, 'data');
    }
  }

  /**
   * Creates the associated DOM element from a template.
   *
   * @return {Node|string}
   * 
   * @alias module:meno~ui.Element#template
   */
  template(data) {
    return null;
  }

  /** 
   * @see ElementUpdateDelegate#isDirty 
   * @alias module:meno~ui.Element#isDirty
   */
  isDirty() { return this.updateDelegate.isDirty.apply(this.updateDelegate, arguments); }

  /** 
   * @see ElementUpdateDelegate#setDirty 
   * @alias module:meno~ui.Element#setDirty
   */
  setDirty() { return this.updateDelegate.setDirty.apply(this.updateDelegate, arguments); }

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
   * @alias module:meno~ui.Element#get
   */
  get(propertyName, defaultInitializer) {
    assertType(propertyName, 'string', false);
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
   * @alias module:meno~ui.Element#set
   */
  set(propertyName, value) {
    assertType(propertyName, 'string', false);
    if (!this.__private__) this.__private__ = {};
    this.__private__[propertyName] = value;
  }

  /**
   * Method invoked when this element is added to the DOM.
   * 
   * @private 
   */
  __init__() {
    console.log(`[${this.constructor.name}] __init__()`);
    
    // Invoke update delegate.
    this.updateDelegate.init();
    
    // Now that the initial update is complete, unhide the element.
    this.setStyle('visibility', this.invisible ? 'hidden' : 'visible');

    if (this.init) this.init();

    // Update the node state to `initialized`.
    this.__setNodeState__(NodeState.INITIALIZED);
  }

  /**
   * Method invoked every time this element is removed from the DOM.
   * 
   * @private
   */
  __destroy__() {
    console.log(`[${this.constructor.name}] __destroy__()`);
    if (this.__private__.eventQueue) this.__private__.eventQueue.kill();
    if (this.destroy) this.destroy();
  }

  /**
   * Renders the template of this element instance.
   * 
   * @private
   */
  __render__() {
    const template = this.template(this.data);

    // If this element doesn't use a template, skip it.
    if (!template) return sightread(this);

    // Otherwise continue processing template.
    console.log(`[${this.constructor.name}] __render__()`);

    // Use VDOM?
    if (USE_VIRTUAL_DOM) {
      // const vtree = h('div', { innerHTML: template });
      const vtree = convertHTML(template);

      if (this.__private__.rootNode === undefined && this.__private__.vtree === undefined) {
        this.__private__.rootNode = createElement(vtree);
        this.removeAllChildren();
        this.appendChild(this.__private__.rootNode);
      }
      else {
        const patches = diff(this.__private__.vtree, vtree);
        this.__private__.rootNode = patch(this.__private__.rootNode, patches);
      }
  
      this.__private__.vtree = vtree;
    }
    else {
      let t = createElement(template);
  
      if (t) {
        if (t instanceof HTMLTemplateElement) {
          t = document.importNode(t.content, true);
          this.removeAllChildren();
          
          if (USE_SHADOW_DOM) {
            if (!this.shadowRoot) this.createShadowRoot();
            this.shadowRoot.appendChild(t);
          }
          else {
            this.appendChild(t);
          }
        }
        else {
          this.removeAllChildren();
          const n = t.childNodes.length;
          for (let i = 0; i < n; i++) {
            let node = document.importNode(t.childNodes[i], true);
            this.appendChild(node);
          }
        }
      }
    }

    sightread(this);

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

    const customChildren = getDirectCustomChildren(this, true);
    const n = customChildren.length;

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
   * Defines all properties.
   *
   * @private
   */
  __defineProperties__() {
    this.__private__ = {};
    this.__private__.childRegistry = {};
    this.__private__.listenerRegistry = {};
    this.data = {};

    /**
     * Current node state of this Element instance.
     *
     * @type {NodeState}
     */
    defineProperty(this, 'nodeState', { defaultValue: NodeState.IDLE, get: true });

    /**
     * ElementUpdateDelegate instance.
     *
     * @type {ElementUpdateDelegate}
     */
    defineProperty(this, 'updateDelegate', { defaultValue: new ElementUpdateDelegate(this), get: true });

    /**
     * Specifies whether this Element instance is invisible. This property
     * follows the rules of the CSS rule 'visibility: hidden'.
     *
     * @type {boolean}
     */
    defineProperty(this, 'invisible', {
      get: true,
      set: (value) => {
        assertType(value, 'boolean', false);

        if (this.nodeState === NodeState.INITIALIZED) {
          if (value) {
            this.setStyle('visibility', 'hidden');
          }
          else {
            if (this.getStyle('visibility') === 'hidden') {
              this.setStyle('visibility', null);
            }
          }
        }

        return value;
      }
    });

    if (this.disabled === undefined) {
      /**
       * Specifies whether this Element instance is disabled.
       *
       * @type {boolean}
       */
      Object.defineProperty(this, 'disabled', {
        get: () => (this.hasAttribute('disabled') ? this.getAttribute('disabled') : false),
        set: (value) => this.setAttribute('disabled', (value ? true : false))
      });
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

    if (nodeState === NodeState.INITIALIZED) {
      this.dispatchEvent(new CustomEvent('nodeinitialize'));
    }
    else if (nodeState === NodeState.DESTROYED) {
      this.dispatchEvent(new CustomEvent('nodedestroy'));
    }

    this.dispatchEvent(new CustomEvent('nodestate', {
      detail: {
        oldValue: oldVal,
        newValue: nodeState
      }
    }));
  }
});

export default Element;
