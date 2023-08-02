'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const cron = require('node-cron');
const fetch = require('node-fetch');

app.use(express.json());
let router = express.Router();

// using async/await AND an array with zipcodes, API req call to accuweather routes
const zipArr = [42210];
const historicalRainData = new Map(); // New Map to store historical rain data globally
const fallsFlowData = new Map(); // new Map to store waterfall flow data globally
const accumulatedRainData = new Map(); // new Map to store all rain history fetched from accuweather API by updateHistoricalRainData function

// Define a function to fetch and update the historical rain data
const updateHistoricalRainData = async () => {
  try {
    const rainDataMap = new Map();

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

// Handle the request for entire historical rain data
router.get('/historicalRain', (req, res, next) => {
  try {
    res.send(Array.from(historicalRainData));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Schedule the task to update historical rain data at 12:15am every day in the timezone containing the zip codes
cron.schedule('20 10 * * *', () => {
  updateHistoricalRainData();
});

// Handle the initial request for recent rain data
router.get('/recentRain', (req, res, next) => {
  try {
    const rainDataMap = new Map();

    // Use the existing rainDataMap if available
    if (historicalRainData.size > 0) {
      const latestEntry = [...historicalRainData.entries()].pop();
      // const latestEntry = historicalRainData. entries().slice(-1);
      const [timestamp, data] = latestEntry;
      for (let zipcode of zipArr) {
        rainDataMap.set(zipcode, data.find(entry => entry[0] === zipcode)[1]);
      }
    } else {
      for (let zipcode of zipArr) {
        rainDataMap.set(zipcode, { "value": "No data", "unit": "" });
      }
    }
    historicalRainData.set(Date.now(), Array.from(rainDataMap)); // store accumulated historicalRainData 
    console.log(historicalRainData); 

    res.send({ "rainDataMap": Array.from(rainDataMap) });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Function to check if rain is flowing (greater than or equal to 1 inch)
function isRainFlowing(rainData) {
  return rainData.value >= 1 ? 'Yes' : 'No';
}

// API route to get the rain flow status for each zipcode
router.get('/rainFlowStatus', (req, res, next) => {
  try {
    const fallsFlowMap = new Map();

    // Use the existing fallsFlowMap if available
    if (historicalRainData.size > 0) {
      const latestEntry = [...historicalRainData.entries()].pop();
      const [timestamp, data] = latestEntry;
      for (let [zipcode, rainData] of data) {
        fallsFlowMap.set(zipcode, isRainFlowing(rainData));
      }
    } else {
      for (let zipcode of zipArr) {
        fallsFlowMap.set(zipcode, 'No data');
      }
    }
    fallsFlowData.set(Date.now(), Array.from(fallsFlowMap)); //store fallsFlowData with timestamps
    console.log(fallsFlowData);

    res.send({ "fallsFlowMap": Array.from(fallsFlowMap) });
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
