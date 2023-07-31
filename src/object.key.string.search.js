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

function getValueByTraversing(obj, key) {
    const keys = key.split(/(?<!\\)\./); // Split the key by dots that are not preceded by a backslash
    keys.forEach((k, index) => {
        keys[index] = k.replace(/\\./g, '.'); // Replace any backslash followed by a dot with just the dot
    });

    let current = obj;
    for (const k of keys) {
        current = current[k];
        if (current === undefined) {
            return undefined; // Key not found
        }
    }
    return current;
}

// Example usage:
const obj = {
    "test": "value",
    "tester.10": {
        "tests": 10,
        "tester": 120,
        "testing": {
            "te": 10
        }
    }
};

const key1 = "test";
const value1 = getValueByTraversing(obj, key1);
console.log(value1); // Output: "value"

const key2 = "tester\\.10.testing\\.te"; // Use "tester\\.10" to search the key
const value2 = getValueByTraversing(obj, key2);
console.log(value2); // Output: 10

const key3 = "tester\\.10.tester"; // Use "tester\\.10" to search the key
const value3 = getValueByTraversing(obj, key3);
console.log(value3); // Output: 120

const key4 = "tester\\.10.testing\\.nonExistent"; // Use "tester\\.10" to search the key
const value4 = getValueByTraversing(obj, key4);
console.log(value4); // Output: undefined (Key not found)


// Example usage:
const objs = {
    "test": "value",
    "tester.10": {
        "tests": 10,
        "tester": 120,
        "testing.20": {
            "te": 10
        }
    }
};
const value5 = getValueByTraversing(objs, "tester\\.10.testing\\.20.10");
console.log(value5);

// const { expect } = require('chai');
// const sinon = require('sinon');

// // Import the function to be tested
// const { getValueByTraversing } = require('./your-file-containing-getValueByTraversing');

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

//   it('should return the value "value" when key is "test"', () => {
//     const result = getValueByTraversing(obj, 'test');
//     expect(result).to.equal('value');
//   });

//   it('should return the nested object associated with key "tester.10"', () => {
//     const result = getValueByTraversing(obj, 'tester\\.10');
//     expect(result).to.deep.equal({
//       "tests": 10,
//       "tester": 120,
//       "testing": {
//         "te": 10
//       }
//     });
//   });

//   it('should return the value 10 when key is "tester\\.10.testing.te"', () => {
//     const result = getValueByTraversing(obj, 'tester\\.10.testing.te');
//     expect(result).to.equal(10);
//   });

//   it('should return the value 120 when key is "tester\\.10.tester"', () => {
//     const result = getValueByTraversing(obj, 'tester\\.10.tester');
//     expect(result).to.equal(120);
//   });

//   it('should return undefined when key is "tester\\.10.testing.nonExistent"', () => {
//     const result = getValueByTraversing(obj, 'tester\\.10.testing.nonExistent');
//     expect(result).to.be.undefined;
//   });

//   it('should return undefined when key is "nonExistent"', () => {
//     const result = getValueByTraversing(obj, 'nonExistent');
//     expect(result).to.be.undefined;
//   });

//   // Test case to check if the correct keys are accessed during traversal
//   it('should access correct keys during traversal', () => {
//     const spy = sinon.spy(obj, 'tester.10.testing.te');
//     getValueByTraversing(obj, 'tester\\.10.testing.te');
//     expect(spy.calledOnce).to.be.true;
//     spy.restore();
//   });
// });
