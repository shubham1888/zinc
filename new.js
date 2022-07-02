// const conn = require('./db/connection');
// let data = {
//   username: "ram",
//   password: "pass123",
//   email: "ramemail123"
// }
// conn(data,"signup");
const inquirer = require("inquirer");
const hell = async () => {
    let ans = await inquirer
        .prompt([
            {
                name: "data",
                message: "[Data] # ",
            },
        ]);
    console.log(ans.data);
}
hell();