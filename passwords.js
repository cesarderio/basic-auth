'use strict';

let base64 = require('base-64');
let bcrypt = require('bcrypt');

console.log('--------BASE 64------------');

let str = 'Raphael pass 123';
let encodedStr = base64.encode(str);
let decodedStr = base64.decode(encodedStr);

console.log('str', str);
console.log('encodedStr', encodedStr);
console.log('decodedStr', decodedStr);

console.log('-----------HASHING with bcrypt------');

let password= 'pass123';
let complexity = 5;

encrypt(password, complexity);

async function encrypt(password, complexity){
  let hashedPassword = await bcrypt.hash(password, complexity);
  console.log(hashedPassword);

  let exampleOne = '$2b$05$9jo15QokNjuk6pwHWPkvsuG7bTj/WujWlrC56ViKiXZyPymTkW1Im';
  let exampleTwo = '$2b$05$7Ec7bR11AoxjhE9EqLfvve.K5dSYx9YeU6jRrPKVTKx5nxwSpFUPW';
  let exampleThree = '$2b$05$mZ.jJfGaS8G7HF.DRilYoeqvaOZqV2cavhTbp2Mfernt2855OvnZizzzzz';

  let isValidPassword = await bcrypt.compare(password, exampleOne);

  let isValidOne = await bcrypt.compare(password, exampleOne);
  let isValidTwo = await bcrypt.compare(password, exampleTwo);
  let isValidThree = await bcrypt.compare(password, exampleThree);

  console.log('isValidPassword:', isValidPassword);
  console.log('isValidOne:', isValidOne);
  console.log('isValidTwo:', isValidTwo);
  console.log('isValidThree:', isValidThree);
}


// module.exports =
