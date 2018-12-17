// Import the modules /////////////////////////////
const http = require("http");
const request = require("request");
const fs = require("fs");
const inquirer = require("inquirer");
const Papa = require("papaparse")
const _ = require("underscore");
//////////////////////////////////////////////////

// data setups //////////////////////////////////
const onlineCostData = "https://s3.us-east-2.amazonaws.com/cc-eng/2018-coding-excercise/cablecast-cdn-costs.csv";
const onlineCustomerData = "https://s3.us-east-2.amazonaws.com/cc-eng/2018-coding-excercise/cablecast-customers.csv";
const costData = "./data/costs.csv";
const customerData = "./data/customers.csv";
const costFile = fs.createReadStream(costData, (error)=> {
  if (error) throw error;
});
const customerFile = fs.createReadStream(customerData, (error)=> {
  if (error) throw error;
});
////////////////////////////////////////////////////////////

// helper functions //////////////////////////////////////////////////////

// for adding arrays
const calcArr = (total, num) => {
  return total + num;
}

// returns the sum total of all values in the array
const sum = (arr)=> {
  return _.reduce(arr, (memo, num)=> { return memo + num}, 0); 
}

const octDays = 31;
const novDays = 30;

/////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////

// download latest files via stream /////////////////////////
// TODO: it's currently interfering with Papa Parse "line: 131"
// // cost csv
// request(onlineCostData)
// .pipe(fs.createWriteStream("./data/costs.csv"));

// // customer csv
// request(onlineCustomerData)
// .pipe(fs.createWriteStream("./data/customers.csv"));
///////////////////////////////////////////////////

console.log(" ");
console.log("Latest costs.csv and customers.csv files downloaded to ./data...");
console.log("|--------------------------------------------------------|");
console.log("|--------------------------------------------------------|");
console.log("|--------------------------------------------------------|");
console.log(" ");
console.log("   ______        __     __                          __ ")
console.log("  / ____/____ _ / /_   / /___   _____ ____ _ _____ / /_")
console.log(" / /    / __ `// __ \\ / // _ \\ / ___// __ `// ___// __/")
console.log("/ /___ / /_/ // /_/ // //  __// /__ / /_/ /(__  )/ /_  ")
console.log("\\____/ \\__,_//_.___//_/ \\___/ \\___/ \\__,_//____/ \\__/  ")
console.log("                                                       ")
console.log("    ___                   __                        ")
console.log("   /   |   ____   ____ _ / /__  __ ____  ___   _____")
console.log("  / /| |  / __ \\ / __ `// // / / //_  / / _ \\ / ___/")
console.log(" / ___ | / / / // /_/ // // /_/ /  / /_/  __// /    ")
console.log("/_/  |_|/_/ /_/ \\__,_//_/ \\__, /  /___/\\___//_/     ")
console.log("                         /____/           ")
console.log(" ");
console.log("|--------------------------------------------------------|");
console.log("|--------------------------------------------------------|");
console.log("|--------------------------------------------------------|");
initialize();

// initialize the node application with choices ///////////////////////////////////
function initialize() {
  inquirer.prompt({
      name: "options",
      type: "list",
      message: "Choose an option...",
      choices: [
        "1. What is the average cost per customer per month for providing CDN services.",
        "2. What is the average number of GBs transferred per customer per month.",
        "3. Which customer uses the most amount of data per month.",
        "4. Which customer(s) use the least amount of data per month.",
        "5. Throw out the five highest/lowest users of data, and the average cost and data usage per customer.",
        "6. List of Customer names with average monthly cost data usage sorted from highest to lowest.",
        "7. What is the cost of and data usage for untagged customers.",
        "8. List any customer ids that are present in the ERP export."
      ]
  })
  .then(answer =>{
      switch (answer.options) {
          case "1. What is the average cost per customer per month for providing CDN services.":
              averageCostPerCustomer();
              break;
          case "2. What is the average number of GBs transferred per customer per month.":
              averageGigPerCustomer();
              break;
          case "3. Which customer uses the most amount of data per month.":
              mostDataUsed()
              break;
          case "4. Which customer(s) use the least amount of data per month.":
              leastDataUsed();
              break;
          case "5. Throw out the five highest/lowest users of data, and the average cost and data usage per customer.":
              fiveHighestLowest();
              break;
          case "6. List of Customer names with average monthly cost data usage sorted from highest to lowest.":
              sortAverageMonthCost();
              break;
          case "7. What is the cost of and data usage for untagged customers.":
              untaggedCustomers();
              break;
          case "8. List any customer ids that are present in the ERP export.":
              existingERPCustomers();
              break;
      }
  })
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


// FUNCTION SETUPS///////////////// ////////////////////////////////////////////////////////////////////////

// 1. What is the average cost per customer per month for providing CDN services. ///////////////////////
const averageCostPerCustomer = ()=> {
  Papa.parse(costFile, {
    delimiter: ",",
    escapeChar: '"',
    complete: (results)=> {
      // user id array
      let userArr = []

      // oct array
      let octArr = [];

      // nov array
      let novArr = [];

      // total cost array
      let totalCostArr = [];
      // totalCostArr = indexData[1];

      // simplify results data into indexData
      const indexData = results.data;

      // users start from 1, ex: indexData[0][1] || userId[1] is userid 13312($)
      let userId = indexData[0]

      // from 2 to 32 is october, from 33 to 62 is november
      // const dailyCost = indexData[5][1];

      // calculate the cost average for each user; total 105 users
      // console.log(userId[7])

      // store user ID into an array, total 105 users
      for (i = 0; i < 105; i++) {
        userArr.push(userId[i])
      }

      // store each row from october into an array
      for (x = 2; x < 33; x++) {
        octArr.push(indexData[x])
      }

      // store each row from november into an array
      for (x = 33; x < 63; x++) {
        novArr.push(indexData[x])
      }

      // TODO: traverse each array in the octArrTransposed/novArrTransposed array and convert each property to a float


      // use underscore.js's zip function to transpose the matrix, convert columns into rows
      const octArrTransposed = _.zip.apply(_, octArr)
      const novArrTransposed = _.zip.apply(_, novArr)

      // clean the array by using underscore's compact. removes NaN, Nulls, etc. for adding
      _.compact(octArrTransposed);
      _.compact(novArrTransposed);

      // using the sum(array)/octDays function, we can caculate the average
      // TODO: sum(array) doesn't work, need to convert the array of strings into float

      for (i = 0; i < octArrTransposed[0].length; i++) {
        console.log("|-----------------------",octArrTransposed[0][i],"----------------------------|");
        console.log(octArrTransposed[i], "Average:", sum(octArrTransposed[i])/octDays);
        console.log("|---------------------------------------------------------------|");
      }
      

      for (i = 0; i < novArrTransposed[0].length; i++) {
        console.log("|-----------------------",novArrTransposed[0][i],"----------------------------|");
        console.log(novArrTransposed[i], "Average:", sum(novArrTransposed[i])/novDays);
        console.log("|---------------------------------------------------------------|");
      }

    }
  })
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// 2. What is the average number of GBs transferred per customer per month. /////////////////////////////////
const averageGigPerCustomer = () => {

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// 3. Which customer uses the most amount of data per month. ////////////////////////////////////////////////
const mostDataUsed = () => {

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// 4. Which customer(s) use the least amount of data per month. /////////////////////////////////////////////
const leastDataUsed = () => {

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// 5. Throw out the five highest/lowest users of data, and the average cost and data usage per customer. //
const fiveHighestLowest = () => {

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// 6. List of Customer names with average monthly cost data usage sorted from highest to lowest.////////////
const sortAverageMonthCost = () => {

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// 7. What is the cost of and data usage for untagged customers. ////////////////////////////////////////////
const untaggedCustomers = () => {

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// 8. List any customer ids that are present in the ERP export. ////////////////////////////////////////////
const existingERPCustomers = () => {

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////