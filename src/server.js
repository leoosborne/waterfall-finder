'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const cron = require('node-cron');

app.use(express.json());

let router = express.Router();

// using async/await AND and array with zipcodes, API req call to accuweather routes
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

// Schedule the task to run at 12:30am every day in the timezone containing the zip codes
cron.schedule('3 10 * * *', () => {
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

// router.get('/recentRain', async (req, res, next) => {
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

//     res.send({ "rainDataMap": Array.from(rainDataMap) });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// using async/await, API req call to accuweather routes
// let rainPast24Hours = 0;

// router.get('/recentRain/:location', async (req, res, next) => {
//   try {
//     const response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${req.params.location}?apikey=${process.env.ACCUWEATHER_API_KEY}&details=${true}`);
//     const json = await response.json();

//     if (json.Code) {
//       res.send({ "value": "Error", "unit": "None" });
//       return;
//     }

//     const rainDataMap = new Map();
//     rainDataMap.set(
//       req.params.location,
//       json[0].PrecipitationSummary.Past24Hours.Imperial.Value + " " +
//       json[0].PrecipitationSummary.Past24Hours.Imperial.Unit
//     );
//     console.log(rainDataMap);
//     rainPast24Hours = rainDataMap.get(req.params.location);

//     res.send({ "location": rainPast24Hours });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// // API req call to accuweather routes
// let rainPast24Hours = 0;
// router.get('/recentRain/:location', (req, res, next) => {
//     fetch(`http://dataservice.accuweather.com/currentconditions/v1/${req.params.location}?apikey=${process.env.ACCUWEATHER_API_KEY}&details=${true}`)
//         .then(response => response.json())

//         .then(json => {

//             if (json.Code) {
//                 res.send({ "value": "Error", "unit": "None" });
//                 return;
//             }

//             const rainDataMap = new Map();
//             rainDataMap.set(
//                 req.params.location,
//                 json[0].PrecipitationSummary.Past24Hours.Imperial.Value + " " +
//                 json[0].PrecipitationSummary.Past24Hours.Imperial.Unit 
//             );

//             rainPast24Hours = rainDataMap.get(req.params.location);

//             res.send({"location": rainPast24Hours });//send the rainPast24Hours value back to the client | needed to create a key value pair here, not just the variable
            

//         }) 

//         .catch(error => {
//             console.error(error);
//             res.status(500).send("Internal Server Error");
//         });
// });



// Justin's API req to accuweather | current temperature
// router.get('/recentRain/:location', (req, res, next) => {
//     fetch(`http://dataservice.accuweather.com/currentconditions/v1/${req.params.location}?apikey=${process.env.ACCUWEATHER_API_KEY}&details=${true}`)  
//     .then(response => {
//         response.json()
//             .then(json => {

//                 if (json.Code) {
//                     res.send({"value": "Error", "unit": "None"});
//                     return;
//                 }   

//                 let returnObject = {
//                     "value": json[0].PrecipitationSummary.Past24Hours.Imperial.Value, 
//                     "unit": json[0].PrecipitationSummary.Past24Hours.Imperial.Unit
//                 }

//                 console.log(returnObject);
//                 res.send(returnObject);
//             })
//     })
//     .catch(error => {
//         console.error(error)
//     })
// })  

router.get('/users', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ hello: 'world' }));
})

router.get('/users/:groups/:id', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ hello: req.params.groups + 'world' + req.params.id }));
})

app.use('/api', router);

//middleware to serve static files
app.use(express.static('../public'));

//start the server
app.listen(3000, () => {
    console.log('App is listening on port 3000');
});