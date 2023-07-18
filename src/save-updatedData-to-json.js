'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const cron = require('node-cron');
const fetch = require('node-fetch');

app.use(express.json());
let router = express.Router();

// Using async/await AND an array with zipcodes, API req call to accuweather routes
let zipArr = [42210, 40206];
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

    const timestamp = Date.now();
    historicalRainData.set(timestamp, Array.from(rainDataMap)); // Store data with timestamp
    console.log(historicalRainData);

    return { timestamp, data: Array.from(rainDataMap) }; // Return the timestamp and data
  } catch (error) {
    console.error(error);
  }
};

// Schedule the task to run at 12:30am every day in the timezone containing the zip codes
cron.schedule('30 0 * * *', async () => {
  const updatedData = await updateHistoricalRainData();
  console.log(`cron ran updateHistoricalRainData() at 12:30am ${updatedData.timestamp}`);
  // You can use the updatedData object here or pass it to other functions for further processing
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
