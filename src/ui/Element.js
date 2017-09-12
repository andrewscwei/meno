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
import getDataRegistry from '../dom/getDataRegistry';
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

/**
 * @class
 *
 * Abstract class of Node/classes that inherited from Node. Note that this class
 * is an abstract class and must be 'mixed' into an real class.
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
  static get extends() { return null; }

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
    let s = this.getAttribute('name');
    if (!s || s === '') return null;
    return s;
  }
  set name(val) {
    // Once set, name cannot change.
    if (!this.name) super.setAttribute('name', val);
  }

  /**
   * State of this Element instance (depicted by Directive.State).
   *
   * @type {string}
   * 
   * @event 'state' - Dispatched when the value is changed.
   * @alias module:meno~ui.Element#state
   */
  get state() {
    let s = this.getAttribute(Directive.STATE);
    if (!s || s === '') return null;
    return s;
  }
  set state(val) {
    if (this.state === val) return;

    let oldValue = this.state;

    if (val === null || val === undefined)
      this.removeAttribute(Directive.STATE);
    else
      this.setAttribute(Directive.STATE, val);

    this.updateDelegate.setDirty(DirtyType.STATE);

    let event = new CustomEvent('state', {
      detail: {
        property: 'state',
        oldValue: oldValue,
        newValue: val
      }
    });

    this.dispatchEvent(event);
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
   * @inheritdoc 
   * @ignore
   */
  createdCallback() {
    // Define instance properties.
    this.__defineProperties__();

    // Check if this Element needs seed data from the data registry.
    this.setData(getDataRegistry(this.getAttribute(Directive.REF)));

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
      this.setData(propertyName, this.getAttribute(attribute.name), true);
    }

    // Make element invisible until its first update.
    this.setStyle('visibility', 'hidden');
  }

  /** 
   * @inheritdoc 
   * @ignore
   */
  attachedCallback() {
    this.render();
    this.__setNodeState__(NodeState.INITIALIZED);
    this.updateDelegate.init();
  }

  /** 
   * @inheritdoc 
   * @ignore
   */
  detachedCallback() {
    this.destroy();
    this.removeAllEventListeners();
    this.updateDelegate.destroy();
    this.__setNodeState__(NodeState.DESTROYED);
  }

  /**
   * Method invoked every time after this element is rendered.
   * 
   * @alias module:meno~ui.Element#init
   */
  init() {
    // Needs to be overridden.
  }

  /**
   * Method invoked every time before this element is rerendered.
   * 
   * @alias module:meno~ui.Element#destroy
   */
  destroy() {
    if (this.__private__.eventQueue) this.__private__.eventQueue.kill();
  }

  /**
   * Handler invoked whenever a visual update is required.
   * 
   * @alias module:meno~ui.Element#update
   */
  update() {
    if (this.nodeState > NodeState.UPDATED) return;

    if (this.isDirty(DirtyType.RENDER) && this.nodeState === NodeState.UPDATED) this.render();

    if (this.nodeState < NodeState.UPDATED) {
      this.__setNodeState__(NodeState.UPDATED);
      this.invisible = (this.invisible === undefined) ? false : this.invisible;
    }
  }

  /**
   * Renders the template of this element instance.
   * 
   * @alias module:meno~ui.Element#render
   */
  render() {
    if (this.nodeState === NodeState.UPDATED) this.destroy();

    let d = {
      data: this.data,
      state: this.state,
      name: this.name
    };

    let t = this.template(d);
    if (typeof t === 'string') t = createElement(t);

    assert(!t || (t instanceof Node), `Element generated from template() must be a Node instance`);

    if (t) {
      if (t instanceof HTMLTemplateElement) {
        t = document.importNode(t.content, true);

        // TODO: Add support for shadow DOM in the future when it's easier to style.
        if (false) {
          try {
            if (!this.shadowRoot) this.createShadowRoot();
            while (this.shadowRoot.lastChild) this.shadowRoot.removeChild(this.shadowRoot.lastChild);
            this.shadowRoot.appendChild(t);
          }
          catch (err) {}
        }
        else {
          while (this.lastChild) this.removeChild(this.lastChild);
          this.appendChild(t);
        }
      }
      else {
        let n = t.childNodes.length;

        while (this.lastChild) this.removeChild(this.lastChild);

        for (let i = 0; i < n; i++) {
          let node = document.importNode(t.childNodes[i], true);
          this.appendChild(node);
        }
      }
    }

    sightread(this);

    let customChildren = getDirectCustomChildren(this, true);

    if (this.__private__.eventQueue) {
      this.__private__.eventQueue.removeAllEventListeners();
      this.__private__.eventQueue.kill();
    }

    this.__private__.eventQueue = new EventQueue();

    customChildren.forEach((child) => {
      if ((child.nodeState === undefined) || (child.nodeState < NodeState.INITIALIZED))
        this.__private__.eventQueue.enqueue(child, 'nodeinitialize');
    });

    this.__private__.eventQueue.addEventListener('complete', this.init.bind(this));
    this.__private__.eventQueue.start();
  }

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
      case 'name':
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
   * @param {string|object} - Name of the data property if defining only one, or
   *                          an object literal containing key/value pairs to be
   *                          merged into this Element instance's data
   *                          properties.
   * @param {*} - Value of the data property (if defining only one).
   * @param {boolean} - If defining only one data property, specifies whether
   *                    the data property should also be a data attribute of the
   *                    element.
   * 
   * @alias module:meno~ui.Element#setData
   */
  setData() {
    let descriptor = arguments[0];

    if (typeof descriptor === 'string') {
      let value = arguments[1];
      let attributed = arguments[2] || false;

      if (this.hasData(descriptor)) {
        this.data[descriptor] = value;
      }
      else {
        defineProperty(this, descriptor, {
          defaultValue: value,
          dirtyType: DirtyType.DATA,
          get: true,
          set: true,
          attributed: attributed
        }, 'data');
      }
    }
    else {
      assertType(descriptor, 'object', false);
      if (!descriptor) return;
      for (let key in descriptor) {
        this.setData(key, descriptor[key]);
      }
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
    if (this.__private__[propertyName] === undefined) {
      if (typeof defaultInitializer === 'function')
        this.__private__[propertyName] = defaultInitializer();
      else
        this.__private__[propertyName] = defaultInitializer;
    }
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
   * Defines all properties.
   *
   * @private
   */
  __defineProperties__() {
    this.__private__ = {};
    this.__private__.childRegistry = {};
    this.__private__.listenerRegistry = {};

    /**
     * Current node state of this Element instance.
     *
     * @type {NodeState}
     */
    defineProperty(this, 'nodeState', { defaultValue: NodeState.IDLE, get: true });

    /**
     * Data properties.
     *
     * @type {Object}
     * @see module:meno~enums.Directive.DATA
     */
    defineProperty(this, 'data', { defaultValue: {}, get: true });

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

        if (this.nodeState === NodeState.UPDATED) {
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

    if (nodeState === NodeState.INITIALIZED)
      this.dispatchEvent(new CustomEvent('nodeinitialize'));
    else if (nodeState === NodeState.UPDATED)
      this.dispatchEvent(new CustomEvent('nodeupdate'));
    else if (nodeState === NodeState.DESTROYED)
      this.dispatchEvent(new CustomEvent('nodedestroy'));

    this.dispatchEvent(new CustomEvent('nodestate', {
      detail: {
        oldValue: oldVal,
        newValue: nodeState
      }
    }));
  }
});

export default Element;
