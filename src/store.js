/**
 * 
 * Package: mutables
 * Author: Ganesh B
 * Description: Nodejs npm module to work with immutable stores. Manage immutable stores with no jazz in a simple manner. Exploring simpler immutable stores architectures
 * Install: npm i mutables --save
 * Github: https://github.com/ganeshkbhat/store
 * npmjs Link: https://www.npmjs.com/package/store
 * File: store.js
 * File Description: 
 * 
 * 
 * 
*/

/* eslint no-console: 0 */

'use strict';

var _ = require('lodash');
_.mixin(require("lodash-deep"));


// https://javascript.info/mixins#:~:text=Mixins%20can%20make%20use%20of,%2F%2F%20call%20parent%20method%20super.

let eventMixin = {
  /**
   * Subscribe to event, usage:
   *  menu.on('select', function(item) { ... }
  */
  on(eventName, handler) {
    if (!this._eventHandlers) this._eventHandlers = {};
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
  },

  /**
   * Cancel the subscription, usage:
   *  menu.off('select', handler)
   */
  off(eventName, handler) {
    let handlers = this._eventHandlers?.[eventName];
    if (!handlers) return;
    if (!handler) handlers = [];
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }
  },

  /**
   * Generate an event with the given name and data
   *  this.trigger('select', data1, data2);
   */
  trigger(eventName, ...args) {
    if (!this._eventHandlers?.[eventName]) {
      return; // no handlers for that event name
    }

    // call the handlers
    this._eventHandlers[eventName].forEach(handler => handler.apply(this, args));
  }
};

let hooksMixin = {
  register(valuename, callback) {
    console.log("register tester hooks");
    this.on(valuename, callback);
  },

  trigger(eventName, args) {
    if (!this._eventHandlers?.[eventName]) {
      return; // no handlers for that event name
    }

    // call the handlers
    this._eventHandlers[eventName].forEach(handler => handler.apply(this, args));
  },

  unregister(valuename, callback) {
    console.log("unregister tester hooks");
    this.off(valuename, callback);
  }
}

// Add mixin for before and after hooks (rxjs-lite or self event manager based)
// Add event dispatchers and listeners manager
function store(name, value = null, hooks = []) {

  this.name = name;
  var data = value // { value: value, hooks: [] };
  var hooks = [];
  this.get = function (objectname, args) {
    let result = _.get(data, objectname);
    if (!!_.get(hooks, objectname)) {
      this.trigger(objectname, args);
    }
    return result;
  }

  this.set = function (objectname, value, hooks = [], args) {
    if (!_.get(data)) _.set(data, {})
    _.set(data, objectname, value);
    // _.set(hooks, objectname, hooks);
    if (!!_.get(hooks, objectname)) {
      this.trigger(objectname, args);
    }
  }

}

Object.assign(store.prototype, eventMixin);
Object.assign(store.prototype, hooksMixin);

let s = new store("namer");
s.set("getter", [1, 4]);
// s.set("getter.name", [1, 2, 3, 4]);
console.log(s.get("getter"));
// module.exports.default = store;

