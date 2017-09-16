// © Andrew Wei

'use strict';

import DirtyType from 'enums/DirtyType';
import NodeState from 'enums/NodeState';
import assert from 'assert';
import debounce from 'helpers/debounce';

/**
 * Default refresh (debounce) rate in milliseconds.
 *
 * @const
 * @memberof module:meno~ui.ElementUpdateDelegate
 * @type {number}
 * @default
 */
const DEFAULT_REFRESH_RATE = 0.0;

/**
 * @class
 *
 * Delegate for managing update calls of a Meno Element.
 *
 * @alias module:meno~ui.ElementUpdateDelegate
 */
class ElementUpdateDelegate {
  /**
   * @class
   *
   * Creates a new ElementUpdateDelegate instance.
   *
   * @param {Element} delegate - The Meno Element instance of which this
   *                             ElementUpdateDelgate instance manages.
   *
   * @alias module:meno~ui.ElementUpdateDelegate
   */
  constructor(delegate) {
    /**
     * Stores mouse properties if this ElementUpdateDelegate responds to mouse
     * events.
     *
     * @property {Object}
     */
    Object.defineProperty(this, 'mouse', { value: {}, writable: false });

    /**
     * Stores orientation properties if this ElementUpdateDelgate responds to
     * device orientations (i.e. device accelerometer).
     *
     * @property {Object}
     */
    Object.defineProperty(this, 'orientation', { value: {}, writable: false });

    /**
     * Stores pressed keycodes if this ElementUpdateDelegate responds to
     * keyboard events.
     *
     * @property {Object}
     */
    Object.defineProperty(this, 'keyCode', { value: {}, writable: false });

    /**
     * Delegate of this ElementUpdateDelegate instance.
     *
     * @property {Element}
     */
    Object.defineProperty(this, 'delegate', { value: delegate, writable: false });

    let mDirtyTable = 0;
    let mConductorTable = {};
    let mResizeHandler = null;
    let mScrollHandler = null;
    let mMouseMoveHandler = null;
    let mOrientationChangeHandler = null;
    let mMouseWheelHandler = null;
    let mKeyUpHandler = null;
    let mKeyPressHandler = null;
    let mKeyDownHandler = null;
    let mEnterFrameHandler = null;

    /**
     * Custom requestAnimationFrame implementation.
     *
     * @param {Function} callback
     *
     * @private
     */
    let _requestAnimationFrame = (callback) => {
      let raf = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame) || null;
      if (!raf) raf = (handler) => (window.setTimeout(handler, 10.0));
      return raf(callback);
    };

    /**
     * Custom cancelAnimationFrame implementation.
     *
     * @return {Function|Object} callbackOrId
     *
     * @private
     */
    let _cancelAnimationFrame = function(callbackOrId) {
      let caf = (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame) || null;
      if (!caf) caf = (handler) => (window.clearTimeout(handler));
      return caf(callbackOrId);
    };

    /**
     * Handler invoked when the window resizes.
     *
     * @param {Event} event
     *
     * @private
     */
    let _onWindowResize = (event) => this.setDirty(DirtyType.SIZE);

    /**
     * Handler invoked when the window scrolls.
     *
     * @param {Event} event
     *
     * @private
     */
    let _onWindowScroll = (event) => this.setDirty(DirtyType.POSITION);

    /**
     * Handler invoked when mouse moves in the window.
     *
     * @param {Event} event
     *
     * @private
     */
    let _onWindowMouseMove = (event) => {
      this.mouse.pointerX = event.clientX;
      this.mouse.pointerY = event.clientY;
      this.setDirty(DirtyType.INPUT);
    };

    /**
     * Handler invoked when mouse wheel moves in the window.
     *
     * @param {Event} event
     *
     * @private
     */
    let _onWindowMouseWheel = (event) => {
      this.mouse.wheelX = event.deltaX;
      this.mouse.wheelY = event.deltaY;
      this.setDirty(DirtyType.INPUT);
    };

    /**
     * Handler invoked when device orientation changes.
     *
     * @param {Event} event
     *
     * @private
     */
    let _onWindowOrientationChange = (event) => {
      let x, y, z;

      if (event instanceof window.DeviceOrientationEvent) {
        x = event.beta;
        y = event.gamma;
        z = event.alpha;
      }
      else if (event instanceof window.DeviceMotionEvent) {
        x = event.acceleration.x * 2;
        y = event.acceleration.y * 2;
        z = event.acceleration.z * 2;
      }
      else {
        x = event.orientation.x * 50;
        y = event.orientation.y * 50;
        z = event.orientation.z * 50;
      }

      this.orientation.x = x;
      this.orientation.y = y;
      this.orientation.z = z;

      this.setDirty(DirtyType.ORIENTATION);
    };

    /**
     * Handler invoked when a key is pressed down.
     *
     * @param {Event} event
     *
     * @private
     */
    let _onWindowKeyDown = (event) => {
      if (this.keyCode.down === undefined) this.keyCode.down = [];
      this.keyCode.down.push(event.keyCode);
      this.setDirty(DirtyType.INPUT);
    };

    /**
     * Handler invoked when a key is pressed.
     *
     * @param {Event} event
     *
     * @private
     */
    let _onWindowKeyPress = (event) => {
      if (this.keyCode.press === undefined) this.keyCode.press = [];
      this.keyCode.press.push(event.keyCode);
      this.setDirty(DirtyType.INPUT);
    };

    /**
     * Handler invoked when a key is pressed up.
     *
     * @param {Event} event
     *
     * @private
     */
    let _onWindowKeyUp = (event) => {
      if (this.keyCode.up === undefined) this.keyCode.up = [];
      this.keyCode.up.push(event.keyCode);
      this.setDirty(DirtyType.INPUT);
    };

    /**
     * Handler invoked when frame advances.
     *
     * @param  {Event} event
     *
     * @private
     */
    let _onEnterFrame = (event) => {
      this.setDirty(DirtyType.FRAME);
    }

    /**
     * Sets a dirty type as dirty.
     *
     * @param {number} dirtyType
     */
    this.setDirty = (dirtyType, validateNow) => {
      if (this.isDirty(dirtyType) && !validateNow) return;

      switch (dirtyType) {
        case DirtyType.NONE:
        case DirtyType.ALL:
          mDirtyTable = dirtyType;
          break;
        default:
          mDirtyTable |= dirtyType;
      }

      if (mDirtyTable === DirtyType.NONE) return;

      if (validateNow) {
        this.update();
      }
      else if (!this._pendingAnimationFrame) {
        this._pendingAnimationFrame = _requestAnimationFrame(this.update.bind(this));
      }
      else if (this._pendingAnimationFrame) {
        window.setTimeout(() => this.setDirty(dirtyType, validateNow), 0.0);
      }
    };

    /**
     * Checks dirty status of a given dirty type.
     *
     * @param {number} dirtyType - Dirty type.
     *
     * @return {boolean}
     */
    this.isDirty = (dirtyType) => {
      switch (dirtyType) {
        case DirtyType.NONE:
        case DirtyType.ALL:
          return (mDirtyTable === dirtyType);
        default:
          return ((dirtyType & mDirtyTable) !== 0);
      }
    };

    /**
     * Initializes this ElementUpdateDelegate instance. Must manually invoke.
     */
    this.init = () => {
      this.setDirty(DirtyType.ALL, true);
    };

    /**
     * Destroys this ElementUpdateDelegate instance.
     */
    this.destroy = () => {
      _cancelAnimationFrame(this._pendingAnimationFrame);

      if (mResizeHandler) {
        window.removeEventListener('resize', mResizeHandler);
        window.removeEventListener('orientationchange', mResizeHandler);
      }

      if (mScrollHandler) {
        let conductor = mConductorTable.scroll || window;
        conductor.removeEventListener('scroll', mScrollHandler);
      }

      if (mMouseWheelHandler) {
        let conductor = mConductorTable.mouseWheel || window;
        conductor.removeEventListener('wheel', mMouseWheelHandler);
      }

      if (mMouseMoveHandler) {
        let conductor = mConductorTable.mouseMove || window;
        conductor.removeEventListener('mousemove', mMouseMoveHandler);
      }

      if (mOrientationChangeHandler) {
        if (window.DeviceOrientationEvent)
          window.removeEventListener('deviceorientation', mOrientationChangeHandler);
        else if (window.DeviceMotionEvent)
          window.removeEventListener('devicemotion', mOrientationChangeHandler);
      }

      if (mKeyDownHandler) window.removeEventListener('keydown', mKeyDownHandler);
      if (mKeyPressHandler) window.removeEventListener('keypress', mKeyPressHandler);
      if (mKeyUpHandler) window.removeEventListener('keyup', mKeyUpHandler);
      if (mEnterFrameHandler) window.clearInterval(mEnterFrameHandler);

      this._pendingAnimationFrame = null;

      mResizeHandler = null;
      mScrollHandler = null;
      mMouseWheelHandler = null;
      mMouseMoveHandler = null;
      mOrientationChangeHandler = null;
      mKeyDownHandler = null;
      mKeyPressHandler = null;
      mKeyUpHandler = null;
      mConductorTable = null;
      mEnterFrameHandler = null;
    };

    /**
     * Handler invoked whenever a visual update is required.
     */
    this.update = () => {
      _cancelAnimationFrame(this._pendingAnimationFrame);

      if (this.delegate && this.delegate.update && this.delegate.nodeState <= NodeState.INITIALIZED) {
        this.delegate.update.call(this.delegate);
      }

      // Reset the dirty status of all types.
      this.setDirty(DirtyType.NONE);

      delete this.mouse.pointerX;
      delete this.mouse.pointerY;
      delete this.mouse.wheelX;
      delete this.mouse.wheelY;
      delete this.orientation.x;
      delete this.orientation.y;
      delete this.orientation.z;
      delete this.keyCode.up;
      delete this.keyCode.press;
      delete this.keyCode.down;

      this._pendingAnimationFrame = null;
    };

    /**
     * Sets up the responsiveness to the provided conductor. Only the following
     * event types support a custom conductor; the rest uses window as the
     * conductor:
     *   1. 'scroll'
     *   2. 'wheel'
     *   3. 'mousemove'
     *
     * @param {Object|Number|...args} - This could be the conductor (defaults to
     *                                  window if unspecified), refresh rate
     *                                  (defaults to the default value if
     *                                  unspecified) or the event type(s).
     * @param {number|...args}        - Either the refresh rate (defaults to
     *                                  the default value if unspecified) or
     *                                  the event type(s).
     * @param {...args}               - Event type(s) which the delegate will
     *                                  respond to.
     */
    this.initResponsiveness = function() {
      let args = Array.prototype.slice.call(arguments);

      assert(args.length > 0, 'Insufficient arguments provided');

      let conductor = ((typeof args[0] !== 'number') && (typeof args[0] !== 'string')) ? args.shift() : window;
      let delay = (typeof args[0] === 'number') ? args.shift() : DEFAULT_REFRESH_RATE;
      let universal = (args.length === 0);

      assert(conductor && conductor.addEventListener, 'Invalid conductor specified');

      if (universal || args.indexOf('resize') > -1 || args.indexOf('orientationchange') > -1) {
        if (mResizeHandler) {
          window.removeEventListener('resize', mResizeHandler);
          window.removeEventListener('orientationchange', mResizeHandler);
        }
        mResizeHandler = (delay === 0.0) ? _onWindowResize.bind(this) : debounce(_onWindowResize.bind(this), delay);
        window.addEventListener('resize', mResizeHandler);
        window.addEventListener('orientationchange', mResizeHandler);
      }

      if (universal || args.indexOf('scroll') > -1) {
        if (mScrollHandler) {
          let c = mConductorTable.scroll || window;
          c.removeEventListener('scroll', mScrollHandler);
        }
        mScrollHandler = (delay === 0.0) ? _onWindowScroll.bind(this) : debounce(_onWindowScroll.bind(this), delay);
        mConductorTable.scroll = conductor;
        conductor.addEventListener('scroll', mScrollHandler);
      }

      if (universal || args.indexOf('wheel') > -1) {
        if (mMouseWheelHandler) {
          let c = mConductorTable.mouseWheel || window;
          c.removeEventListener('wheel', mMouseWheelHandler);
        }
        mMouseWheelHandler = (delay === 0.0) ? _onWindowMouseWheel.bind(this) : debounce(_onWindowMouseWheel.bind(this), delay);
        mConductorTable.mouseWheel = conductor;
        conductor.addEventListener('wheel', mMouseWheelHandler);
      }

      if (universal || args.indexOf('mousemove') > -1) {
        if (mMouseMoveHandler) {
          let c = mConductorTable.mouseMove || window;
          c.removeEventListener('mousemove', mMouseMoveHandler);
        }
        mMouseMoveHandler = (delay === 0.0) ? _onWindowMouseMove.bind(this) : debounce(_onWindowMouseMove.bind(this), delay);
        mConductorTable.mouseMove = conductor;
        conductor.addEventListener('mousemove', mMouseMoveHandler);
      }

      if (universal || args.indexOf('deviceorientation') > -1 || args.indexOf('devicemotion') > -1 || args.indexOf('deviceorientation') > -1) {
        if (mOrientationChangeHandler) {
          if (window.DeviceOrientationEvent)
            window.removeEventListener('deviceorientation', mOrientationChangeHandler);
          else if (window.DeviceMotionEvent)
            window.removeEventListener('devicemotion', mOrientationChangeHandler);
        }
        mOrientationChangeHandler = (delay === 0.0) ? _onWindowOrientationChange.bind(this) : debounce(_onWindowOrientationChange.bind(this), delay);
        if (window.DeviceOrientationEvent)
          window.addEventListener('deviceorientation', mOrientationChangeHandler);
        else if (window.DeviceMotionEvent)
          window.addEventListener('devicemotion', mOrientationChangeHandler);
      }

      if (universal || args.indexOf('keydown') > -1) {
        if (mKeyDownHandler) window.removeEventListener('keydown', mKeyDownHandler);
        mKeyDownHandler = _onWindowKeyDown.bind(this);
        window.addEventListener('keydown', mKeyDownHandler);
      }

      if (universal || args.indexOf('keypress') > -1) {
        if (mKeyPressHandler) window.removeEventListener('keypress', mKeyPressHandler);
        mKeyPressHandler = _onWindowKeyPress.bind(this);
        window.addEventListener('keypress', mKeyPressHandler);
      }

      if (universal || args.indexOf('keyup') > -1) {
        if (mKeyUpHandler) window.removeEventListener('keyup', mKeyUpHandler);
        mKeyUpHandler = _onWindowKeyUp.bind(this);
        window.addEventListener('keyup', mKeyUpHandler);
      }

      if (universal || args.indexOf('enterframe') > -1) {
        if (mEnterFrameHandler) window.clearInterval(mEnterFrameHandler);
        mEnterFrameHandler = window.setInterval(_onEnterFrame.bind(this), delay);
      }
    };
  }
}

export default ElementUpdateDelegate;
