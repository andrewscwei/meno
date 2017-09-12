/*! Meno, @license MIT */
'use strict';

import assert from './helpers/assert';
import addChild from './dom/addChild';
import addClass from './dom/addClass';
import addToChildRegistry from './dom/addToChildRegistry';
import createElement from './dom/createElement';
import getAttribute from './dom/getAttribute';
import getChild from './dom/getChild';
import getChildRegistry from './dom/getChildRegistry';
import getClassIndex from './dom/getClassIndex';
import getDataRegistry from './dom/getDataRegistry';
import getElementRegistry from './dom/getElementRegistry';
import getState from './dom/getState';
import getStyle from './dom/getStyle';
import hasAttribute from './dom/hasAttribute';
import hasChild from './dom/hasChild';
import hasClass from './dom/hasClass';
import hasStyle from './dom/hasStyle';
import namespace from './dom/namespace';
import register from './dom/register';
import removeChild from './dom/removeChild';
import removeClass from './dom/removeClass';
import removeFromChildRegistry from './dom/removeFromChildRegistry';
import setAttribute from './dom/setAttribute';
import setDataRegistry from './dom/setDataRegistry';
import setState from './dom/setState';
import setStyle from './dom/setStyle';
import sightread from './dom/sightread';
import Directive from './enums/Directive';
import DirtyType from './enums/DirtyType';
import NodeState from './enums/NodeState';
import Element from './ui/Element';
import EventQueue from './events/EventQueue';

// import 'webcomponents.js/CustomElements.js';

assert(window && document, 'Meno is a front-end web framework where \'window\' and \'document\' must be defined');

/**
 * @module meno
 */
function meno() {
  return (arguments.length > 0) ? register.apply(null, arguments) : sightread.apply(null, arguments);
}

meno.version = VERSION;

meno.Element = Element;
meno.EventQueue = EventQueue;

meno.Directive = Directive;
meno.DirtyType = DirtyType;
meno.NodeState = NodeState;

meno.dom = {
  addChild: addChild,
  addClass: addClass,
  addToChildRegistry: addToChildRegistry,
  createElement: createElement,
  getAttribute: getAttribute,
  getChild: getChild,
  getChildRegistry: getChildRegistry,
  getClassIndex: getClassIndex,
  getDataRegistry: getDataRegistry,
  getElementRegistry: getElementRegistry,
  getState: getState,
  getStyle: getStyle,
  hasAttribute: hasAttribute,
  hasChild: hasChild,
  hasClass: hasClass,
  hasStyle: hasStyle,
  namespace: namespace,
  register: register,
  removeChild: removeChild,
  removeClass: removeClass,
  removeFromChildRegistry: removeFromChildRegistry,
  setAttribute: setAttribute,
  setDataRegistry: setDataRegistry,
  setState: setState,
  setStyle: setStyle,
  sightread: sightread
};

meno.register = function() { return register.apply(null, arguments); }

meno();

module.exports = meno;
