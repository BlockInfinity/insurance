const loki = require("lokijs");
var db = new loki('loki.json')
var contractCollection = db.addCollection('contractCollection')

contractCollection.insert({ address: "_addr", insurer: "_from" })


let contract = contractCollection.findOne({ 'address': "_addr" });
contract.oracle = "_oracle";
contractCollection.update(contract);

let output = contractCollection.findOne({ 'address': "_addr" });

console.log(output)