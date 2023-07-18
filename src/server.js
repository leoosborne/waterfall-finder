'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const cron = require('node-cron');
const fetch = require('node-fetch');

app.use(express.json());
let router = express.Router();

// using async/await AND an array with zipcodes, API req call to accuweather routes
let zipArr = [42210];
let historicalRainData = new Map(); // New Map to store historical rain data globally

// Define a function to fetch and update the historical rain data
const updateHistoricalRainData = async () => {
  try {
    let rainDataMap = new Map();

    for (let zipcode of zipArr) {
      let response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${zipcode}?apikey=${process.env.ACCUWEATHER_API_KEY}&details=${true}`);
      let json = await response.json();

      if (json.Code) {
        rainDataMap.set(zipcode, { "value": "Error", "unit": "None" });
      } else {
        rainDataMap.set(zipcode, {
          "value": json[0].PrecipitationSummary.Past24Hours.Imperial.Value,
          "unit": json[0].PrecipitationSummary.Past24Hours.Imperial.Unit
        });
      }
    }
    historicalRainData.set(Date.now(), Array.from(rainDataMap)); // Store data with timestamp
    console.log(historicalRainData);
  } catch (error) {
    console.error(error);
  }
};

// Schedule the task to run at 12:30am every day in the timezone containing the zip codes
cron.schedule('52 19 * * *', () => {
  updateHistoricalRainData();
  console.log(`cron ran updateHistoricalRainData() at 12:30am ${historicalRainData}`);
});

// Handle the initial request for recent rain data
router.get('/recentRain', async (req, res, next) => {
  try {
    let rainDataMap = new Map();

    for (let zipcode of zipArr) {
      // Use the existing rainDataMap if available
      if (historicalRainData.size > 0) {
        const latestEntry = [...historicalRainData.entries()].pop();
        const [timestamp, data] = latestEntry;
        rainDataMap.set(zipcode, data.find(entry => entry[0] === zipcode)[1]);
      } else {
        rainDataMap.set(zipcode, { "value": "No data", "unit": "" });
      }
    }

    res.send({ "rainDataMap": Array.from(rainDataMap) });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Middleware to serve static files
app.use(express.static('../public'));

// Use the router for API routes
app.use('/api', router);

// Start the server
app.listen(3000, () => {
  console.log('App is listening on port 3000');
});

// 'use strict';

// require('dotenv').config();
// const express = require('express');
// const app = express();
// const cron = require('node-cron');

// app.use(express.json());
// let router = express.Router();

// // using async/await AND an array with zipcodes, API req call to accuweather routes
// let zipArr = [42210, 40206];
// let historicalRainData = new Map(); // New Map to store historical rain data globally

// // Define a function to fetch and update the historical rain data
// const updateHistoricalRainData = async () => {
//   try {
//     let rainDataMap = new Map();

//     for (let zipcode of zipArr) {
//       let response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${zipcode}?apikey=${process.env.ACCUWEATHER_API_KEY}&details=${true}`);
//       let json = await response.json();

//       if (json.Code) {
//         rainDataMap.set(zipcode, { "value": "Error", "unit": "None" });
//       } else {
//         rainDataMap.set(zipcode, {
//           "value": json[0].PrecipitationSummary.Past24Hours.Imperial.Value,
//           "unit": json[0].PrecipitationSummary.Past24Hours.Imperial.Unit
//         });
//       }
//     }
//     historicalRainData.set(Date.now(), Array.from(rainDataMap)); // Store data with timestamp
//     console.log(historicalRainData);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // Schedule the task to run at 12:30am every day in the timezone containing the zip codes
// cron.schedule('9 16 * * *', () => {
//   updateHistoricalRainData();
//   console.log(`cron ran updateHistoricalRainData() at 12:30am ${historicalRainData}`);
// });

// // Handle the initial request for recent rain data
// router.get('/recentRain', async (req, res, next) => {
//   try {
//     let rainDataMap = new Map();

//     for (let zipcode of zipArr) {
//       // Use the existing rainDataMap if available
//       if (historicalRainData.size > 0) {
//         const latestEntry = [...historicalRainData.entries()].pop();
//         const [timestamp, data] = latestEntry;
//         rainDataMap.set(zipcode, data.find(entry => entry[0] === zipcode)[1]);
//       } else {
//         rainDataMap.set(zipcode, { "value": "No data", "unit": "" });
//       }
//     }

//     res.send({ "rainDataMap": Array.from(rainDataMap) });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Middleware to serve static files
// app.use(express.static('../public'));

// // Use the router for API routes
// app.use('/api', router);

// // Start the server
// app.listen(3000, () => {
//   console.log('App is listening on port 3000');
// });









// 'use strict';

// require('dotenv').config();

// const fs = require('fs');
// const express = require('express');
// const app = express();
// const cron = require('node-cron');
// app.use(express.json());
// let router = express.Router();

// // using async/await AND an array with zipcodes, API req call to accuweather routes
// let zipArr = [42210, 40206];
// let historicalRainData = new Map(); // New Map to store historical rain data globally

// // Define a function to fetch and update the historical rain data
// const updateHistoricalRainData = async () => {
//   try {
//     let rainDataMap = new Map();

//     for (let zipcode of zipArr) {
//       let response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${zipcode}?apikey=${process.env.ACCUWEATHER_API_KEY}&details=${true}`);
//       let json = await response.json();

//       if (json.Code) {
//         rainDataMap.set(zipcode, { "value": "Error", "unit": "None" });
//       } else {
//         rainDataMap.set(zipcode, {
//           "value": json[0].PrecipitationSummary.Past24Hours.Imperial.Value,
//           "unit": json[0].PrecipitationSummary.Past24Hours.Imperial.Unit
//         });
//       }
//     }
//     historicalRainData.set(Date.now(), Array.from(rainDataMap)); // Store data with timestamp
//     console.log(historicalRainData);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // Schedule the task to run at 12:30am every day in the timezone containing the zip codes
// cron.schedule('23 15 * * *', () => {
//   updateHistoricalRainData();
//   console.log(`cron ran updateHistoricalRainData() at 12:30am ${historicalRainData}`);
// });

// // Handle the initial request for recent rain data
// router.get('/recentRain', async (req, res, next) => {
//   try {
//     let rainDataMap = new Map();

//     for (let zipcode of zipArr) { 
//       // Use the existing rainDataMap if available
//       if (historicalRainData.size > 0) {
//         const latestEntry = [...historicalRainData.entries()].pop();
//         const [timestamp, data] = latestEntry;
//         rainDataMap.set(zipcode, data.find(entry => entry[0] === zipcode)[1]);
//       } else {
//         rainDataMap.set(zipcode, { "value": "No data", "unit": "" });
//       }
//     }

//     res.send({ "rainDataMap": Array.from(rainDataMap) });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });



// router.get('/users', (req, res, next) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify({ hello: 'world' }));
// })

// router.get('/users/:groups/:id', (req, res, next) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify({ hello: req.params.groups + 'world' + req.params.id }));
// })

// app.use('/api', router);

// //middleware to serve static files
// app.use(express.static('../public'));

// //start the server
// app.listen(3000, () => {
//     console.log('App is listening on port 3000');
// });