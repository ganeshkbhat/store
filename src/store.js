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
    if (!handler || handler === "all") handlers = [];
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
    console.log("registering hooks");
    this.on(valuename, callback);
  },

  trigger(eventName, args) {
    if (!this._eventHandlers?.[eventName]) {
      return new Error("Event not registered"); // no handlers for that event name
    }

    // call the handlers
    this._eventHandlers[eventName].forEach(handler => handler.apply(this, args));
  },

  unregister(valuename, callback) {
    console.log("unregistering hooks");
    this.off(valuename, callback);
  }
}

// Add mixin for before and after hooks (rxjs-lite or self event manager based)
// Add event dispatchers and listeners manager
function store(name, value = null, hooks = {}) {
  this.name = name;
  var data = { value: value, hooks: hooks } // { value: value, hooks: {} };

  /** 
   * 
   * // Example 1
    const obj1 = { a: { b: { c: [10, 20], "tester.cc": 10 } } };
    const result1 = getValue(obj1, 'a.b.c');
    console.log(result1); // Output: [10, 20]

    // Example 2
    const obj2 = { a: { b: { c: [10, 20], "tester.cc": 10 } } };
    const result2 = getValue(obj2, 'a.b.c.0');
    console.log(result2); // Output: 10

    // Example 3
    const obj3 = { a: { b: { c: [10, 20], "tester.cc": 10 } } };
    const result3 = getValue(obj3, 'a.b.c.5');
    console.log(result3); // Output: undefined

    // Example 4
    const obj4 = { a: { b: { c: [10, 20], "tester.cc": 10 } } };
    const result4 = getValue(obj4, 'a.b');
    console.log(result4); // Output: { c: [10, 20] }

    // Example 5
    const obj5 = { a: { b: { c: [10, 20], "tester.cc": 10 } } };
    const result5 = getValue(obj5, 'a');
    console.log(result5); // Output: { b: { c: [10, 20] } }

    // Example 6
    const obj6 = { a: { b: { c: [10, 20], "tester.cc": 10 } } };
    const result6 = getValue(obj6, 'a.b.tester\\.cc');
    console.log(result6); // Output: 10
   *
   */
  this.getValue = function getValue(obj, path) {
    const keys = path.split(/(?<!\\)\./); // Split the path by dot, ignoring escaped dots
    let value = obj;
    for (const key of keys) {
      const parsedKey = key.replace(/\\./g, '.');

      if (value.hasOwnProperty(parsedKey)) {
        value = value[parsedKey]; // Update the value based on the current key
      } else {
        return undefined; // Return undefined if any key is not found
      }
    }
    return value;
  }


  /** 
   * 
   * // Example usage:
    const obj = { a: { b: { c: [10, 20], "tester.cc": 10 } } };

    // Setting value at 'a.b.c'
    const result1 = setValue(obj, 'a.b.c', [30, 40]);
    console.log(result1); // Output: { a: { b: { c: [30, 40], "tester.cc": 10 } } }

    // Setting value at 'a.b.c.2'
    const result2 = setValue(obj, 'a.b.c.2', 50);
    console.log(result2); // Output: { a: { b: { c: [30, 40, 50], "tester.cc": 10 } } }

    // Setting value at 'a.b.d'
    const result3 = setValue(obj, 'a.b.d', { x: 100 });
    console.log(result3); // Output: { a: { b: { c: [30, 40, 50], "tester.cc": 10, d: { x: 100 } } } }

    // Setting value at 'a.e'
    const result4 = setValue(obj, 'a.e', 'Hello');
    console.log(result4); // Output: { a: { b: { c: [30, 40, 50], "tester.cc": 10, d: { x: 100 } }, e: 'Hello' } }
   * 
   */
  this.setValue = function setValue(obj, path, value) {
    const keys = path.split(/(?<!\\)\./); // Split the path by dot, ignoring escaped dots
    let currentObj = obj;
    let lastKey = keys.pop(); // Remove the last key from the array
    for (const key of keys) {
      const parsedKey = key.replace(/\\./g, '.');
      if (!currentObj.hasOwnProperty(parsedKey)) {
        currentObj[parsedKey] = {}; // Create nested objects if the key doesn't exist
      }
      currentObj = currentObj[parsedKey]; // Update the current object reference
    }
    currentObj[lastKey.replace(/\\./g, '.')] = value; // Set the value at the last key
    return obj; // Return the updated object
  }

  this.set = function (objectname, value, hooks = [], args) {
    data.value = this.setValue(data.value, objectname, value);
    data.hooks = this.setValue(data.hooks, objectname, hooks);
    if (!!this.getValue(data.hooks, objectname)) {
      this.trigger(objectname, args);
    }
  }

  this.get = function (objectname, args) {
    data.value = this.getValue(data.value, objectname);
    if (!!this.getValue(data.hooks, objectname)) {
      this.trigger(objectname, args);
    }
  }

}

Object.assign(store.prototype, eventMixin);
Object.assign(store.prototype, hooksMixin);

let s = new store("namer");
s.set("getter", [1, 4]);

console.log(s.get("getter"));

module.exports.default = store;

