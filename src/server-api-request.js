const cron = require('node-cron');

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
    historicalRainData.set(Date.now(), Array.from(rainDataMap)); // Store data with timestamp
    console.log(historicalRainData);
  } catch (error) {
    console.error(error);
  }
};

// Schedule the task to run at midnight every day in the timezone containing the zip codes
cron.schedule('0 0 * * *', () => {
  updateHistoricalRainData();
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
