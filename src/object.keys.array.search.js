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

const { expect } = require('chai');
const sinon = require('sinon');

function getValueByTraversing(obj, keysArr) {
  const keys = keysArr.map(k => k.replace(/\\(.)/g, '$1')); // Remove backslashes before dots

  let current = obj;
  for (const k of keys) {
    current = current[k];
    if (current === undefined) {
      return undefined; // Key not found
    }
  }
  return current;
}


// // Test cases using Mocha, Chai, and Sinon
// describe('getValueByTraversing', () => {
//   const obj = {
//     "test": "value",
//     "tester.10": {
//       "tests": 10,
//       "tester": 120,
//       "testing": {
//         "te": 10
//       }
//     }
//   };

//   it('should return the value "value" when keysArr is ["test"]', () => {
//     const result = getValueByTraversing(obj, ['test']);
//     expect(result).to.equal('value');
//   });

//   it('should return the nested object associated with keysArr ["tester\\.10"]', () => {
//     const result = getValueByTraversing(obj, ['tester\\.10']);
//     expect(result).to.deep.equal({
//       "tests": 10,
//       "tester": 120,
//       "testing": {
//         "te": 10
//       }
//     });
//   });

//   it('should return the value 10 when keysArr is ["tester\\.10", "testing", "te"]', () => {
//     const result = getValueByTraversing(obj, ['tester\\.10', 'testing', 'te']);
//     expect(result).to.equal(10);
//   });

//   it('should return undefined when keysArr is ["tester\\.10", "testing", "nonExistent"]', () => {
//     const result = getValueByTraversing(obj, ['tester\\.10', 'testing', 'nonExistent']);
//     expect(result).to.be.undefined;
//   });

//   it('should return undefined when keysArr is ["nonExistent"]', () => {
//     const result = getValueByTraversing(obj, ['nonExistent']);
//     expect(result).to.be.undefined;
//   });
// });
