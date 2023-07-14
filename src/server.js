'use strict';


require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

let router = express.Router();

// using async/await AND and array with zipcodes, API req call to accuweather routes
const zipArr = [42210, 40206];

router.get('/recentRain', async (req, res, next) => {
  try {
    const rainDataMap = new Map();

    for (const zipcode of zipArr) {
      const response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${zipcode}?apikey=${process.env.ACCUWEATHER_API_KEY}&details=${true}`);
      const json = await response.json();

      if (json.Code) {
        rainDataMap.set(zipcode, { "value": "Error", "unit": "None" });
      } else {
        rainDataMap.set(zipcode, {
          "value": json[0].PrecipitationSummary.Past24Hours.Imperial.Value,
          "unit": json[0].PrecipitationSummary.Past24Hours.Imperial.Unit
        });
      }
    }
    console.log(rainDataMap);
    res.send({ "rainDataMap": Array.from(rainDataMap) });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


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
