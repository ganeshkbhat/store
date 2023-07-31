// 
// const obj1 = {
//   key1: 'value1',
//   key2: {
//     nestedKey1: 'nestedValue1',
//     nestedKey2: 'nestedValue2',
//   },
// };

// const obj2 = {
//   key2: {
//     nestedKey2: 'nestedValue2',
//     nestedKey1: 'nestedValue1',
//   },
//   key1: 'value1',
// };
//
// console.log(compareObjectKeys(obj1, obj2)); // Output: true
//


function compareObjectKeys(obj1, obj2) {
    // Get the keys of the objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    // Check if the number of keys is the same
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    // Sort the keys to ensure consistent comparison
    keys1.sort();
    keys2.sort();
  
    // Check each key
    for (let i = 0; i < keys1.length; i++) {
      const key1 = keys1[i];
      const key2 = keys2[i];
  
      // Check if the keys are the same
      if (key1 !== key2) {
        return false;
      }
  
      const value1 = obj1[key1];
      const value2 = obj2[key2];
  
      // Recursively check if the values are objects
      if (typeof value1 === 'object' && typeof value2 === 'object') {
        const keysMatch = compareObjectKeys(value1, value2);
        if (!keysMatch) {
          return false;
        }
      }
    }
  
    // All keys match
    return true;
  }
  