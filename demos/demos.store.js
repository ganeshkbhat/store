
const store = require('../index.js').store;

let s = new store("namer");
s.set("getter", [1, 4]);
console.log(s.get("getter"));

