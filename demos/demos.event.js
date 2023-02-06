let s = new store("namer");
s.on("test", val => console.log(val))
s.trigger("test", "tester event")
console.log(s);