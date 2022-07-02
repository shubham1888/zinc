const axios = require('axios');
const colors = require("colors");
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
module.exports = conn;