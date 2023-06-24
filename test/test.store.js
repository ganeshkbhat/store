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

const sinon = require('sinon');
const { expect } = require('chai');

// Import the getValue and setValue functions
const store = require('../index.js').store; // Replace 'your-file' with the actual file name

describe('getValue', () => {
  const obj = { a: { b: { c: [10, 20], "tester.cc": 10 } } };

  it('should return the correct value for a valid path', () => {
    const result = store.getValue(obj, 'a.b.c');
    expect(result).to.deep.equal([10, 20]);
  });

  it('should return the correct value for an index in an array path', () => {
    const result = store.getValue(obj, 'a.b.c.0');
    expect(result).to.equal(10);
  });

  it('should return undefined for an invalid index in an array path', () => {
    const result = store.getValue(obj, 'a.b.c.5');
    expect(result).to.be.undefined;
  });

  it('should return the correct value for a nested object path', () => {
    const result = store.getValue(obj, 'a.b');
    expect(result).to.deep.equal({ c: [10, 20], "tester.cc": 10 });
  });

  it('should return the correct value for the root object path', () => {
    const result = store.getValue(obj, 'a');
    expect(result).to.deep.equal({ b: { c: [10, 20], "tester.cc": 10 } });
  });

  it('should return the correct value for a key with escaped dot', () => {
    const result = store.getValue(obj, 'a.b.tester\\.cc');
    expect(result).to.equal(10);
  });

  it('should return undefined for an invalid path', () => {
    const result = store.getValue(obj, 'a.b.x');
    expect(result).to.be.undefined;
  });
});

describe('setValue', () => {
  let obj;

  beforeEach(() => {
    obj = { a: { b: { c: [10, 20], "tester.cc": 10 } } };
  });

  it('should set the value at the specified path', () => {
    const result = store.setValue(obj, 'a.b.c', [30, 40]);
    expect(result).to.deep.equal({ a: { b: { c: [30, 40], "tester.cc": 10 } } });
  });

  it('should set the value at the specified index in an array path', () => {
    const result = store.setValue(obj, 'a.b.c.2', 50);
    expect(result).to.deep.equal({ a: { b: { c: [10, 20, 50], "tester.cc": 10 } } });
  });

  it('should create nested objects and set the value at the specified path', () => {
    const result = store.setValue(obj, 'a.b.d.x', 100);
    expect(result).to.deep.equal({ a: { b: { c: [10, 20], "tester.cc": 10, d: { x: 100 } } } });
  });

  it('should set the value at the root object path', () => {
    const result = store.setValue(obj, 'a', 'Hello');
    expect(result).to.deep.equal({ a: 'Hello' });
  });

  it('should not modify the original object', () => {
    store.setValue(obj, 'a.b.c', [30, 40]);
    expect(obj).to.deep.equal({ a: { b: { c: [10, 20], "tester.cc": 10 } } });
  });

  it('should throw an error for an invalid path', () => {
    expect(() => store.setValue(obj, 'a.b.x', 50)).to.throw(Error, 'Invalid path');
  });
});
