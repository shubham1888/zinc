#!/usr/bin/env node
const mongoose = require("mongoose");
const colors = require("colors");
const inquirer = require("inquirer");
const { Command } = require("commander");
const program = new Command();
// https://api.imgflip.com/get_memes
// https://weatherdbi.herokuapp.com/data/weather/nepal
let newDate = new Date();
let date = newDate.toISOString().slice(0, 10);
let time = newDate.toLocaleTimeString();
let currentDateTime = date + " - " + time;

const mySchema = new mongoose.Schema({
  data: {
    type: String,
  },
  date: {
    type: String,
  },
});

const mySchemaData = mongoose.model("DATA", mySchema);

const quoteFunc = () => {
  const axios = require("axios");
  const url = "https://quotes.rest/qod";
  // make a get request to the url
  axios({
    method: "get",
    url: url,
    headers: { Accept: "application/json" }, // this api needs this header set for the request
  })
    .then((res) => {
      const quote = res.data.contents.quotes[0].quote;
      const author = res.data.contents.quotes[0].author;
      const log = console.log(`${quote} - ${author}`.yellow);
      console.log(log);
    })
    .catch((err) => {
      const log = console.log(err);
      console.log(log);
    });
};

const connection = () => {
  // Replace the following with your Atlas connection string
  const conString =
    "mongodb+srv://shubham:pymongo@cluster0.xsd2e.mongodb.net/test?retryWrites=true&w=majority";

  console.log("Connecting to server...".yellow);

  mongoose
    .connect(conString)
    .then(() => {
      console.log("Connnection successful".yellow);
    })
    .catch((err) => console.log(`${err}`.red));
};

const createDocument = () => {
  inquirer
    .prompt([
      {
        name: "data",
        message: "[Data] # ",
      },
    ])
    .then((answers) => {
      let data = answers.data;
      const myData = new mySchemaData({ data, date: currentDateTime });
      myData
        .save()
        .then(() => {
          console.log("Data saved successfully".green);
        })
        .catch((err) => {
          console.log(`${err}`.red);
        });
    });
};

const updateDocument = (data) => {
  inquirer
    .prompt([
      {
        name: "data",
        message: "[New Data] # ",
      },
    ])
    .then(async(answers) => {
      const myData = await mySchemaData.findByIdAndUpdate(data,{data:answers.data});
      console.log(`${myData}`.yellow);
      console.log("Data updated".yellow);
    });
};

const readDocument = async () => {
  const myData = await mySchemaData.find();
  console.log(`${myData}`.yellow);
  console.log(`[${myData.length}] results found`.green);
};

const deleteDocument = async (data) => {
  const myData = await mySchemaData.findByIdAndDelete(data);
  console.log(`${myData}`.yellow);
  console.log("Data deleted".yellow);
};

program
  .name("index.js i | u | g | d | ")
  .description("CLI to store data")
  .version("1.1.0");

program
  .command("connect")
  .description("Connect to the server.")
  .action(() => {
    connection();
  });

program
  .command("i")
  .description("Insert data to the server.")
  .action(() => {
    connection();
    createDocument();
  });

program
  .command("u")
  .description("Insert data to the server.")
  .argument("<string>", "string of id")
  .action((str) => {
    connection();
    updateDocument(str);
  });

program
  .command("g")
  .description("Get data from the server.")
  .action(() => {
    connection();
    readDocument();
  });

program
  .command("d")
  .description("Delete data to the server.")
  .argument("<string>", "string of id")
  .action((str) => {
    connection();
    deleteDocument(str);
  });

program
  .command("q")
  .description("Quoteof the day.")
  .action(() => {
    quoteFunc();
  });

program.parse();
