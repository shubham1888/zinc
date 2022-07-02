// const conn = require('./db/connection');
// let data = {
//   username: "ram",
//   password: "pass123",
//   email: "ramemail123"
// }
// conn(data,"signup");
// const inquirer = require("inquirer");





const CryptoJS = require("crypto-js");

// Encrypt
const encryptedPassword = CryptoJS.AES.encrypt('password', 'secret key 123').toString();
console.log(encryptedPassword); // 'my message'

// Decrypt
const decryptedpassword = CryptoJS.AES.decrypt(encryptedPassword, 'secret key 123');
const originalPassword = decryptedpassword.toString(CryptoJS.enc.Utf8);

console.log(originalPassword); // 'my message'