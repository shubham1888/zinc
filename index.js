#!/usr/bin/env node
const express = require("express");
const CryptoJS = require("crypto-js");
require('dotenv').config()
const inquirer = require("inquirer");
const axios = require('axios');
const colors = require("colors");
// const conn = require('./db/connection');
const { Command } = require("commander");
const program = new Command();

// https://api.imgflip.com/get_memes
// https://weatherdbi.herokuapp.com/data/weather/nepal
let newDate = new Date();
let date = newDate.toISOString().slice(0, 10);
let time = newDate.toLocaleTimeString();
let currentDateTime = date + " - " + time;

const conn = async (data, table) => {
  if (data) {
    try {
      const res = await axios.post(`https://zinc-d8bea-default-rtdb.firebaseio.com/${table}.json`, {
        data
      });
      if (res) {
        console.log(colors.green("Data stored"));
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("Empty data!");
  }
}

function expressServer() {
  const app = express();
  const port = 3000;
  app.use(express.json());
  app.get("/", async (req, res) => {
    try {
      const myJson = await mySchemaData.find();
      res.json(myJson);
    } catch (error) {
      console.log(colors.red(error));
    }
  });
  app.get("/:id", async (req, res) => {
    try {
      // console.log(typeof(req.params.id));
      const myJson = await mySchemaData.findById({ _id: req.params.id });
      res.json(myJson);
    } catch (error) {
      console.log(colors.red(error));
    }
  });
  app.listen(port, () => {
    console.log(colors.green(`Server running at port ${port}`));
    console.log(colors.yellow.underline(`http://localhost:${port}/`));
  });
  // process.exit(1);
}

const createDocument = async () => {
  const ans = await inquirer
    .prompt([
      {
        name: "data",
        message: "[Data] # ",
      },
    ]);
  conn(ans.data, "data");
  console.log(colors.green("Data stored successfully"));
};

const readDocument = async (table) => {
  try {
    const res = await axios.get(`https://zinc-d8bea-default-rtdb.firebaseio.com/${table}.json`);
    if (res) {
      console.log(colors.yellow(res.data));
    } else {
      console.log(colors.red('Error'));
    }
  } catch (error) {
    console.error(error);
  }
};

const login = async (table) => {
  console.log(colors.yellow("Login"));
  const username = await inquirer
    .prompt([
      {
        name: "username",
        message: "[Username] # ",
      },
    ]);
  const password = await inquirer
    .prompt([
      {
        name: "password",
        message: "[Password] # ",
      },
    ]);
  if (username.username && password.password) {
    try {
      const res = await axios.get(`https://zinc-d8bea-default-rtdb.firebaseio.com/${table}.json`);
      if (res) {
        let loginFlaf = 0;
        for (let i = 0; i < Object.values(res.data).length; i++) {
          // Decrypt
          // Last_Login
          // put
          const decryptedpassword = CryptoJS.AES.decrypt(Object.values(res.data)[i].data.password, process.env.SECRET_KEY);
          const originalPassword = decryptedpassword.toString(CryptoJS.enc.Utf8);
          if (Object.values(res.data)[i].data.username === username.username && originalPassword === password.password) {
            loginFlaf = 1;
            // try {
            //   const resToUpdate = await axios.patch(`https://zinc-d8bea-default-rtdb.firebaseio.com/${table}.json`, {
            //     Last_Login: currentDateTime
            //   });
            // } catch (error) {
            //   console.error(error);
            // }
            console.log(colors.yellow(`Login as ${Object.values(res.data)[i].data.username}`))
          }
        }
        if (loginFlaf === 0) {
          console.log(colors.red("Invalid credentials!"));
          login("users");
        }
      } else {
        console.log(colors.red('Error'));
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log(colors.red("Enter username and password"));
    signup();
  }
}

const signup = async () => {
  console.log(colors.yellow("Signup"));
  const username = await inquirer
    .prompt([
      {
        name: "username",
        message: "[Username] # ",
      },
    ]);
  const password = await inquirer
    .prompt([
      {
        name: "password",
        message: "[Password] # ",
      },
    ]);
  // Encrypting Password
  // console.log(process.env.SECRET_KEY)
  const encryptedPassword = CryptoJS.AES.encrypt(password.password, process.env.SECRET_KEY).toString();
  let data = {
    username: username.username,
    password: encryptedPassword,
    Joined_Date: currentDateTime,
    Last_Login: currentDateTime
  }
  conn(data, "users");
  console.log(colors.green("User added"));
  login("users");
}

program
  .name("zinc i | u | g | d ")
  .description("Zinc CLI to store data for shubham")
  .version("3.0.0");

program
  .command("i")
  .description("Insert data to the server.")
  .action(() => {
    createDocument();
  });

program
  .command("u")
  .description("Insert data to the server.")
  .argument("<string>", "string of id")
  .action((str) => {
    updateDocument(str);
  });

program
  .command("g")
  .description("Get data from the server.")
  .action(() => {
    readDocument("users");
  });

program
  .command("d")
  .description("Delete data to the server.")
  .argument("<string>", "string of id")
  .action((str) => {
    deleteDocument(str);
  });

program
  .command("s")
  .description("Signup")
  .action(() => {
    signup();
  });

program
  .command("l")
  .description("users")
  .action(() => {
    login("users");
  });

program.parse();
