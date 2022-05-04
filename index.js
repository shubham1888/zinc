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

const welcome = () => {
  console.log(colors.yellow(" ____________             __          __    "));
  console.log(colors.yellow("|________   /            |   \\       |  |  "));
  console.log(colors.yellow("        /  /             |    \\      |  |  "));
  console.log(colors.yellow("       /  /              |     \\     |  |  "));
  console.log(colors.blue("      /  /               |  |\\  \\    |  |   "));
  console.log(colors.blue("     /  /                |  | \\  \\   |  |   "));
  console.log(colors.blue("    /  /                 |  |  \\  \\  |  |   "));
  console.log(colors.green("   /  /                  |  |   \\  \\ |  |  "));
  console.log(colors.green("  /  /________           |  |    \\   |  |   "));
  console.log(colors.green(" /____________|          |__|     \\__|__|   "));
  console.log("");
  console.log("");
  console.log("");
  console.log("");
  console.log("");
  console.log("");
  console.log("");
};

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
      const title = res.data.contents.quotes[0].title;
      const category = res.data.contents.quotes[0].category;
      console.log(colors.green(`[Title] # ${title}`));
      console.log(colors.green(`[Category] # ${category}`));
      console.log(colors.green(`[Author] # ${author}`));
      console.log(colors.yellow(`${quote}`));
      process.exit(1);
    })
    .catch((err) => {
      const log = console.log(err);
      console.log(colors.green(log));
    });
};

const connection = () => {
  // Replace the following with your Atlas connection string
  const conString =
    "mongodb+srv://shubham:pymongo@cluster0.xsd2e.mongodb.net/test?retryWrites=true&w=majority";

  console.log(colors.yellow("Connecting to server..."));

  mongoose
    .connect(conString)
    .then(() => {
      console.log(colors.yellow("Connnection successful"));
    })
    .catch((err) => {
      console.log(colors.red(err));
      connection();
    });
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
          console.log(colors.green("Data saved successfully"));
          process.exit(1);
        })
        .catch((err) => {
          console.log(colors.red(err));
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
    .then(async (answers) => {
      const myData = await mySchemaData.findByIdAndUpdate(data, {
        data: answers.data,
      });
      console.log(colors.yellow(myData));
      console.log(colors.yellow("Data updated"));
      process.exit(1);
    });
};

const readDocument = async () => {
  const myData = await mySchemaData.find();
  console.log(colors.yellow(`${myData}`));
  console.log(colors.green(`[${myData.length}] results found`));
  process.exit(1);
};

const deleteDocument = async (data) => {
  const myData = await mySchemaData.findByIdAndDelete(data);
  console.log(colors.yellow(myData));
  console.log(colors.yellow("Data deleted"));
  process.exit(1);
};

const search = async (data) => {
  inquirer
    .prompt([
      {
        name: "data",
        message: "[Query] # ",
      },
    ])
    .then(async (answers) => {
      const myData = await mySchemaData.findById({ _id: answers.data });
      if (myData === null) {
        console.log(colors.red("[0] results found"));
      } else {
        console.log(colors.yellow(myData));
        process.exit(1);
      }
    });
};

program
  .name("zinc c | i | u | g | d | q | s | w | ")
  .description("Zinc CLI to store data for shubham")
  .version("3.0.0");

program
  .command("c")
  .description("Connect to the server.")
  .action(() => {
    welcome();
    connection();
  });

program
  .command("i")
  .description("Insert data to the server.")
  .action(() => {
    welcome();
    connection();
    createDocument();
  });

program
  .command("u")
  .description("Insert data to the server.")
  .argument("<string>", "string of id")
  .action((str) => {
    welcome();
    connection();
    updateDocument(str);
  });

program
  .command("g")
  .description("Get data from the server.")
  .action(() => {
    welcome();
    connection();
    readDocument();
  });

program
  .command("d")
  .description("Delete data to the server.")
  .argument("<string>", "string of id")
  .action((str) => {
    welcome();
    connection();
    deleteDocument(str);
  });

program
  .command("q")
  .description("Quoteof the day.")
  .action(() => {
    welcome();
    quoteFunc();
  });

program
  .command("s")
  .description("Search  data from db by id.")
  .action(() => {
    welcome();
    connection();
    search();
  });

program
  .command("w")
  .description("Welcome screen")
  .action(() => {
    welcome();
  });

program.parse();
