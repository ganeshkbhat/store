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

  this.getValue = function getValue(obj, path) {
    /** 
 *    // Example 1
      const obj1 = { a: { b: { c: [10, 20] } } };
      const result1 = getValue(obj1, 'a.b.c');
      console.log(result1); // Output: [10, 20]

      // Example 2
      const obj2 = { a: { b: { c: [10, 20] } } };
      const result2 = getValue(obj2, 'a.b.c.0');
      console.log(result2); // Output: 10

      // Example 3
      const obj3 = { a: { b: { c: [10, 20] } } };
      const result3 = getValue(obj3, 'a.b.c.5');
      console.log(result3); // Output: undefined

      // Example 4
      const obj4 = { a: { b: { c: [10, 20] } } };
      const result4 = getValue(obj4, 'a.b');
      console.log(result4); // Output: { c: [10, 20] }

      // Example 5
      const obj5 = { a: { b: { c: [10, 20] } } };
      const result5 = getValue(obj5, 'a');
      console.log(result5); // Output: { b: { c: [10, 20] } }
     */
    const keys = path.split('.'); // Split the path into an array of keys
    let value = obj;
    for (const key of keys) {
      if (value.hasOwnProperty(key)) {
        value = value[key]; // Update the value based on the current key
      } else {
        return undefined; // Return undefined if any key is not found
      }
    }

    return value;
  }

  /** 
   * 
    // Example 1
    const obj1 = { a: {} };
    const value1 = [10, 20];
    const result1 = setValue(obj1, 'a.b.c', value1);
    console.log(result1); // Output: { a: { b: { c: [10, 20] } } }

    // Example 2
    const obj2 = { a: { b: { c: [10, 20] } } };
    const value2 = { test: 10 };
    const result2 = setValue(obj2, 'a.b.c.0', value2);
    console.log(result2); // Output: { a: { b: { c: [{ test: 10 }, 10, 20] } } }

    // Example 3
    const obj3 = { a: { b: { c: [10, 20] } } };
    const value3 = { test: 10 };
    const result3 = setValue(obj3, 'a.b.c.5', value3);
    console.log(result3); // Output: { a: { b: { c: [10, 20, undefined, undefined, undefined, { test: 10 }] } } }

   */
  this.setValue = function setValue(obj, path, value) {
    const keys = path.split('.'); // Split the path into an array of keys
    let currentObj = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!currentObj.hasOwnProperty(key) || typeof currentObj[key] !== 'object') {
        currentObj[key] = {}; // Create an empty object if the key doesn't exist or its value is not an object
      }
      currentObj = currentObj[key]; // Update the current object to the nested object
    }
    const lastKey = keys[keys.length - 1];
    const lastKeyIsArrayIndex = /^\d+$/.test(lastKey); // Check if the last key is a valid array index
    if (lastKeyIsArrayIndex) {
      const index = parseInt(lastKey);
      if (Array.isArray(currentObj)) {
        currentObj[index] = value; // Assign the value to the array index
      } else {
        currentObj = Array(index).fill(undefined); // Fill with undefined values until the desired index
        currentObj[index] = value; // Assign the value to the array index
      }
    } else {
      currentObj[lastKey] = value; // Set the value for the last key
    }
    return obj;
  }

  this.get = function (objectname, args) {
    let result = _.get(data.value, objectname);
    if (!!_.get(data.hooks, objectname)) {
      this.trigger(objectname, args);
    }
    return result;
  }

  this.set = function (objectname, value, hooks = [], args) {
    // if (!_.get(data.value, objectname)) {
    data.value = _.extend(data.value, { [objectname]: value });
    data.hooks = _.extend(data.hooks, { [objectname]: hooks });
    // }

    if (!!_.get(data.hooks, objectname)) {
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

