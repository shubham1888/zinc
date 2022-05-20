#!/usr/bin/env node
const mongoose = require("mongoose");
const express = require("express");
const colors = require("colors");
const inquirer = require("inquirer");
const { Command } = require("commander");
const os = require("os");
const { download } = require("express/lib/response");
const program = new Command();
const fs = require("fs");

const app = express();
const port = 3000;
// https://api.imgflip.com/get_memes
// https://weatherdbi.herokuapp.com/data/weather/nepal
let newDate = new Date();
let date = newDate.toISOString().slice(0, 10);
let time = newDate.toLocaleTimeString();
let currentDateTime = date + " - " + time;

const conRemoteString ="mongodb+srv://shubham:pymongo@cluster0.xsd2e.mongodb.net/test?retryWrites=true&w=majority";
const conLocalString = "mongodb://localhost:27017";

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
  console.log(colors.red("-----------------------------------------"));
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
  expressServer();
  inquirer
    .prompt([
      {
        type: os.platform() == "win32" || "linux" ? "list" : "rawlist",
        name: "dbname",
        message: "",
        choices: ["[1]Connect to local DB", "[2]Connect to remote DB"],
      },
    ])
    .then((answers) => {
      const data = answers.dbname;
      const charAtData = data.charAt(1);
      if (charAtData == 1) {
        var conString = "mongodb://localhost:27017";
      } else if (charAtData == 2) {
        var conString =
          "mongodb+srv://shubham:pymongo@cluster0.xsd2e.mongodb.net/test?retryWrites=true&w=majority";
      } else {
        connection();
      }
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
    });
};

function expressServer() {
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
      if (data) {
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
      } else {
        console.log("Please fill data");
        createDocument();
      }
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
  for (let index = 0; index < myData.length; index++) {
    const data = myData[index];
    console.log(colors.yellow(`[${index}] # ${data._id}`));
    console.log(colors.yellow(`[Date] # ${data.date}`));
    console.log(colors.yellow(`--# ${data.data}`));
    console.log(colors.red("----------------------------"));
    console.log("");
  }
  console.log(colors.green(`[${myData.length}] results found`));
  // process.exit(1);
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

const downloadData = async () => {
  // connection();
  console.log(colors.yellow("Connecting to remote server..."));
  var conString =
    "mongodb+srv://shubham:pymongo@cluster0.xsd2e.mongodb.net/test?retryWrites=true&w=majority";
  mongoose
    .connect(conString)
    .then(() => {
      console.log(colors.yellow("Connnection successful"));
    })
    .catch((err) => {
      console.log(colors.red(err));
      downloadData();
    });
  const myData = await mySchemaData.find();
  const stringData = JSON.stringify(myData);
  // appendFile function with filename, content and callback function
  fs.appendFile("data.json", stringData, function (err) {
    if (err) throw err;
    console.log(colors.green("Data downloaded successfully."));
  });
};

const migrateData = async () => {
  const conString = "mongodb://localhost:27017";
  console.log(colors.yellow("Connecting to local server..."));
  mongoose
    .connect(conString)
    .then(() => {
      console.log(colors.yellow("Connnection successful"));
    })
    .catch((err) => {
      console.log(colors.red(err));
    });
  const localData = await mySchemaData.find();
  console.log(localData);
  console.log(colors.red("It may take some time..."));
  setTimeout(async () => {
    await mongoose.disconnect();
    setTimeout(() => {
      connection();
      setTimeout(() => {
        for (let index = 0; index < localData.length; index++) {
          const data = localData[index];
          const newData = new mySchemaData({
            _id: data._id,
            data: data.data,
            date: data.date,
          });
          newData.save();
        }
        console.log(colors.green("Successfully data migrated"));
        setTimeout(async () => {
          await mongoose.disconnect();
        }, 5000);
        process.exit(1);
      }, 10000);
    }, 5000);
  }, 5000);
};

const options = () => {
  inquirer
    .prompt([
      {
        type: os.platform() == "win32" || "linux" ? "list" : "rawlist",
        name: "data",
        message: "Choose # ",
        choices: [
          "[1] Migrate data from local to remote DB",
          "[2] Save a File by [Text Editor]",
          "[3] Download data",
        ],
      },
    ])
    .then((answers) => {
      const data = answers.data;
      const charAtData = data.charAt(1);
      if (charAtData == 1) {
        migrateData();
      } else if (charAtData == 2) {
        inquirer
          .prompt([
            {
              type: "editor",
              name: "content",
              message: "Content # ",
            },
          ])
          .then(async (answers) => {
            const content = answers.content;
            if (content === "") {
              console.log("Empty Field");
            } else {
              connection();
              const myData = new mySchemaData({
                data: content,
                date: currentDateTime,
              });
              await myData.save();
            }
          });
      } else if (charAtData == 3) {
        downloadData();
      } else {
        console.log("Invalid operation");
        options();
      }
    });
};

program
  .name("zinc c | i | u | g | d | q | s | w | o | m |")
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

program
  .command("o")
  .description("Multiple options")
  .action(() => {
    welcome();
    options();
  });

program
  .command("m")
  .description("Migrate data from local to remote DB")
  .action(() => {
    welcome();
    migrateData();
  });

program.parse();
