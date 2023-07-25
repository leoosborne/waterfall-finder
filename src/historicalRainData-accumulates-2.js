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

// Object to store data for each zipcode
const rainDataByZipcode = {};

// Define a function to fetch and update the historical rain data
const updateHistoricalRainData = async () => {
  try {
    for (let zipcode of zipArr) {
      let response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${zipcode}?apikey=${process.env.ACCUWEATHER_API_KEY}&details=${true}`);
      let json = await response.json();

      if (json.Code) {
        rainDataByZipcode[zipcode] = { "value": "Error", "unit": "None" };
      } else {
        rainDataByZipcode[zipcode] = {
          "value": json[0].PrecipitationSummary.Past24Hours.Imperial.Value,
          "unit": json[0].PrecipitationSummary.Past24Hours.Imperial.Unit
        };
      }
    }

    const timestamp = new Date().toISOString(); // Get current timestamp
    historicalRainData.set(timestamp, { ...rainDataByZipcode }); // Store data with timestamp
    console.log(historicalRainData);
  } catch (error) {
    console.error(error);
  }
};

// Schedule the task to update historical rain data at 12:15am every day in the timezone containing the zip codes
cron.schedule('7 18 * * *', () => {
  updateHistoricalRainData();
});

