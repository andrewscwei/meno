// © Andrew Wei

import DirtyType from '../enums/DirtyType';
import getRect from '../utils/getRect';

if (process.env.NODE_ENV === `development`) {
  var assert = require(`assert`);
}

/**
 * Default refresh (debounce) rate in milliseconds.
 *
 * @const
 * @memberof module:meno~core.ElementUpdateDelegate
 * @type {number}
 * @default
 */
const DEFAULT_REFRESH_RATE = 0.0;

/**
 * Returns a function that, as long as it continues to be invoked, will not be
 * triggered. The function will be called after it stops being called for N
 * milliseconds. If 'leading' is passed, the function will be triggered on the
 * leading edge instead of the trailing.
 *
 * @param {Function} method - Method to be debounced.
 * @param {number} [delay=0] - Debounce rate in milliseconds.
 * @param {boolean} [leading=false] - Indicates whether the method is triggered
 *                                    on the leading edge instead of the
 *                                    trailing.
 *
 * @return {Function} The debounced method.
 *
 * @alias module:meno~helpers.debounce
 */
function debounce(method, delay, leading) {
  if (delay === undefined) delay = 0;
  if (leading === undefined) leading = false;

  let timeout;

  return function() {
    let context = this;
    let args = arguments;

    let later = function() {
      timeout = null;
      if (!leading) method.apply(context, args);
    };

    let callNow = leading && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);

    if (callNow) method.apply(context, args);
  };
}

/**
 * @class
 *
 * Delegate for managing update calls of a Meno Element.
 *
 * @alias module:meno~core.ElementUpdateDelegate
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
   * @alias module:meno~core.ElementUpdateDelegate
   */
  constructor(delegate) {
    /**
     * Stores mouse properties if this ElementUpdateDelegate responds to mouse
     * events.
     *
     * @property {Object}
     */
    Object.defineProperty(this, `mouse`, { value: {}, writable: false });

    /**
     * Stores orientation properties if this ElementUpdateDelgate responds to
     * device orientations (i.e. device accelerometer).
     *
     * @property {Object}
     */
    Object.defineProperty(this, `orientation`, { value: {}, writable: false });

    /**
     * Stores pressed keycodes if this ElementUpdateDelegate responds to
     * keyboard events.
     *
     * @property {Object}
     */
    Object.defineProperty(this, `keyCode`, { value: {}, writable: false });

    /**
     * Delegate of this ElementUpdateDelegate instance.
     *
     * @property {Element}
     */
    Object.defineProperty(this, `delegate`, { value: delegate, writable: false });

    let mDirtyTable = 0;
    let mDirtyInfo = {};
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
    let _onWindowResize = (event) => {
      if (!mDirtyInfo[DirtyType.SIZE]) mDirtyInfo[DirtyType.SIZE] = {};
      mDirtyInfo[DirtyType.SIZE].conductorRect = getRect(event.currentTarget || window);
      mDirtyInfo[DirtyType.SIZE].rect = getRect(this.delegate);
      this.setDirty(DirtyType.SIZE);
    };

    /**
     * Handler invoked when the window scrolls.
     *
     * @param {Event} event
     *
     * @private
     */
    let _onWindowScroll = (event) => {
      if (!mDirtyInfo[DirtyType.POSITION]) mDirtyInfo[DirtyType.POSITION] = {};
      mDirtyInfo[DirtyType.POSITION].conductorRect = getRect(event.currentTarget || window);
      mDirtyInfo[DirtyType.POSITION].rect = getRect(this.delegate);
      this.setDirty(DirtyType.POSITION);
    };

    /**
     * Handler invoked when mouse moves in the window.
     *
     * @param {Event} event
     *
     * @private
     */
    let _onWindowMouseMove = (event) => {
      if (!mDirtyInfo[DirtyType.INPUT]) mDirtyInfo[DirtyType.INPUT] = {};
      mDirtyInfo[DirtyType.INPUT].mouseX = event.clientX;
      mDirtyInfo[DirtyType.INPUT].mouseY = event.clientY;
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
      if (!mDirtyInfo[DirtyType.INPUT]) mDirtyInfo[DirtyType.INPUT] = {};
      mDirtyInfo[DirtyType.INPUT].mouseWheelX = event.deltaX;
      mDirtyInfo[DirtyType.INPUT].mouseWheelY = event.deltaY;
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

      if (!mDirtyInfo[DirtyType.ORIENTATION]) mDirtyInfo[DirtyType.ORIENTATION] = {};
      mDirtyInfo[DirtyType.ORIENTATION].x = x;
      mDirtyInfo[DirtyType.ORIENTATION].y = y;
      mDirtyInfo[DirtyType.ORIENTATION].z = z;

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
      if (!mDirtyInfo[DirtyType.INPUT]) mDirtyInfo[DirtyType.INPUT] = {};
      if (!mDirtyInfo[DirtyType.INPUT].keyDown) mDirtyInfo[DirtyType.INPUT].keyDown = [];
      mDirtyInfo[DirtyType.INPUT].keyDown.push(event.keyCode);

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
      if (!mDirtyInfo[DirtyType.INPUT]) mDirtyInfo[DirtyType.INPUT] = {};
      if (!mDirtyInfo[DirtyType.INPUT].keyPress) mDirtyInfo[DirtyType.INPUT].keyPress = [];
      mDirtyInfo[DirtyType.INPUT].keyPress.push(event.keyCode);

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
      if (!mDirtyInfo[DirtyType.INPUT]) mDirtyInfo[DirtyType.INPUT] = {};
      if (!mDirtyInfo[DirtyType.INPUT].keyUp) mDirtyInfo[DirtyType.INPUT].keyUp = [];
      mDirtyInfo[DirtyType.INPUT].keyUp.push(event.keyCode);

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
    };

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

      if (mDirtyTable === DirtyType.NONE) {
        mDirtyInfo = {};
        return;
      }

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
    this.init = (responsiveness) => {
      if (responsiveness) {
        for (let key in responsiveness) {
          const value = responsiveness[key];

          if (typeof value === `number`) {
            this.initResponsiveness.apply(this, [value, key]);
          }
          else if (typeof value === `object`) {
            let args = [];
            if (value.conductor) args.push(value.conductor);
            if (value.delay) args.push(value.delay);
            args.push(key);
            this.initResponsiveness.apply(this, args);
          }
          else {
            this.initResponsiveness.apply(this, [key]);
          }
        }
      }

      this.setDirty(DirtyType.ALL, true);
    };

    /**
     * Destroys this ElementUpdateDelegate instance.
     */
    this.destroy = () => {
      _cancelAnimationFrame(this._pendingAnimationFrame);

      if (mResizeHandler) {
        window.removeEventListener(`resize`, mResizeHandler);
        window.removeEventListener(`orientationchange`, mResizeHandler);
      }

      if (mScrollHandler) {
        let conductor = mConductorTable.scroll || window;
        conductor.removeEventListener(`scroll`, mScrollHandler);
      }

      if (mMouseWheelHandler) {
        let conductor = mConductorTable.mouseWheel || window;
        conductor.removeEventListener(`wheel`, mMouseWheelHandler);
      }

      if (mMouseMoveHandler) {
        let conductor = mConductorTable.mouseMove || window;
        conductor.removeEventListener(`mousemove`, mMouseMoveHandler);
      }

      if (mOrientationChangeHandler) {
        if (window.DeviceOrientationEvent) window.removeEventListener(`deviceorientation`, mOrientationChangeHandler);
        else if (window.DeviceMotionEvent) window.removeEventListener(`devicemotion`, mOrientationChangeHandler);
      }

      if (mKeyDownHandler) window.removeEventListener(`keydown`, mKeyDownHandler);
      if (mKeyPressHandler) window.removeEventListener(`keypress`, mKeyPressHandler);
      if (mKeyUpHandler) window.removeEventListener(`keyup`, mKeyUpHandler);
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

      if (this.delegate && this.delegate.update) {
        this.delegate.update.call(this.delegate, mDirtyInfo);
      }

      // Reset the dirty status of all types.
      this.setDirty(DirtyType.NONE);

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

      if (process.env.NODE_ENV === `development`) {
        assert(args.length > 0, `Insufficient arguments provided`);
      }

      let conductor = ((typeof args[0] !== `number`) && (typeof args[0] !== `string`)) ? args.shift() : window;
      let delay = (typeof args[0] === `number`) ? args.shift() : DEFAULT_REFRESH_RATE;
      let universal = (args.length === 0);

      if (process.env.NODE_ENV === `development`) {
        assert(conductor && conductor.addEventListener, `Invalid conductor specified`);
      }

      if (universal || args.indexOf(`resize`) > -1 || args.indexOf(`orientationchange`) > -1) {
        if (mResizeHandler) {
          window.removeEventListener(`resize`, mResizeHandler);
          window.removeEventListener(`orientationchange`, mResizeHandler);
        }
        mResizeHandler = (delay === 0.0) ? _onWindowResize.bind(this) : debounce(_onWindowResize.bind(this), delay);
        window.addEventListener(`resize`, mResizeHandler);
        window.addEventListener(`orientationchange`, mResizeHandler);

        // Populate update info for initial update.
        if (!mDirtyInfo[DirtyType.SIZE]) mDirtyInfo[DirtyType.SIZE] = {};
        mDirtyInfo[DirtyType.SIZE].conductorRect = getRect(window);
        mDirtyInfo[DirtyType.SIZE].rect = getRect(this.delegate);
      }

      if (universal || args.indexOf(`scroll`) > -1) {
        if (mScrollHandler) {
          let c = mConductorTable.scroll || window;
          c.removeEventListener(`scroll`, mScrollHandler);
        }
        mScrollHandler = (delay === 0.0) ? _onWindowScroll.bind(this) : debounce(_onWindowScroll.bind(this), delay);
        mConductorTable.scroll = conductor;
        conductor.addEventListener(`scroll`, mScrollHandler);

        // Populate update info for initial update.
        if (!mDirtyInfo[DirtyType.POSITION]) mDirtyInfo[DirtyType.POSITION] = {};
        mDirtyInfo[DirtyType.POSITION].conductorRect = getRect(conductor);
        mDirtyInfo[DirtyType.POSITION].rect = getRect(this.delegate);
      }

      if (universal || args.indexOf(`wheel`) > -1) {
        if (mMouseWheelHandler) {
          let c = mConductorTable.mouseWheel || window;
          c.removeEventListener(`wheel`, mMouseWheelHandler);
        }
        mMouseWheelHandler = (delay === 0.0) ? _onWindowMouseWheel.bind(this) : debounce(_onWindowMouseWheel.bind(this), delay);
        mConductorTable.mouseWheel = conductor;
        conductor.addEventListener(`wheel`, mMouseWheelHandler);
      }

      if (universal || args.indexOf(`mousemove`) > -1) {
        if (mMouseMoveHandler) {
          let c = mConductorTable.mouseMove || window;
          c.removeEventListener(`mousemove`, mMouseMoveHandler);
        }
        mMouseMoveHandler = (delay === 0.0) ? _onWindowMouseMove.bind(this) : debounce(_onWindowMouseMove.bind(this), delay);
        mConductorTable.mouseMove = conductor;
        conductor.addEventListener(`mousemove`, mMouseMoveHandler);
      }

      if (universal || args.indexOf(`deviceorientation`) > -1 || args.indexOf(`devicemotion`) > -1 || args.indexOf(`deviceorientation`) > -1) {
        if (mOrientationChangeHandler) {
          if (window.DeviceOrientationEvent) window.removeEventListener(`deviceorientation`, mOrientationChangeHandler);
          else if (window.DeviceMotionEvent) window.removeEventListener(`devicemotion`, mOrientationChangeHandler);
        }
        mOrientationChangeHandler = (delay === 0.0) ? _onWindowOrientationChange.bind(this) : debounce(_onWindowOrientationChange.bind(this), delay);
        if (window.DeviceOrientationEvent) window.addEventListener(`deviceorientation`, mOrientationChangeHandler);
        else if (window.DeviceMotionEvent) window.addEventListener(`devicemotion`, mOrientationChangeHandler);
      }

      if (universal || args.indexOf(`keydown`) > -1) {
        if (mKeyDownHandler) window.removeEventListener(`keydown`, mKeyDownHandler);
        mKeyDownHandler = _onWindowKeyDown.bind(this);
        window.addEventListener(`keydown`, mKeyDownHandler);
      }

      if (universal || args.indexOf(`keypress`) > -1) {
        if (mKeyPressHandler) window.removeEventListener(`keypress`, mKeyPressHandler);
        mKeyPressHandler = _onWindowKeyPress.bind(this);
        window.addEventListener(`keypress`, mKeyPressHandler);
      }

      if (universal || args.indexOf(`keyup`) > -1) {
        if (mKeyUpHandler) window.removeEventListener(`keyup`, mKeyUpHandler);
        mKeyUpHandler = _onWindowKeyUp.bind(this);
        window.addEventListener(`keyup`, mKeyUpHandler);
      }

      if (universal || args.indexOf(`enterframe`) > -1) {
        if (mEnterFrameHandler) window.clearInterval(mEnterFrameHandler);
        mEnterFrameHandler = window.setInterval(_onEnterFrame.bind(this), delay);
      }
    };
  }
}

export default ElementUpdateDelegate;
