'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

let router = express.Router();

router.get('/recentRain/:location', (req, res, next) => {
    fetch(`http://dataservice.accuweather.com/currentconditions/v1/${req.params.location}?apikey=${process.env.ACCUWEATHER_API_KEY}&details=${true}`)  
    .then(response => {
        response.json()
            .then(json => {

                if (json.Code) {
                    res.send({"value": "Error", "unit": "None"});
                    return;
                }            

                const rainDataMap = new Map();
                    rainDataMap.set(
                        req.params.location,
                        json[0].PrecipitationSummary.Past24Hours.Imperial.Value + 
                        json[0].PrecipitationSummary.Past24Hours.Imperial.Unit);
                    
    

                console.log(rainDataMap);
                res.send(rainDataMap);

                // let returnObject = {
                //     "value": json[0].PrecipitationSummary.Past24Hours.Imperial.Value, 
                //     "unit": json[0].PrecipitationSummary.Past24Hours.Imperial.Unit
                // }

                // console.log(returnObject);
                // res.send(returnObject);
             })
    })

    .catch(error => {
        console.error(error)
    })
})


router.get('/users', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({hello: 'world'}));
})

router.get('/users/:groups/:id', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({hello: req.params.groups + 'world' + req.params.id}));
})

app.use('/api', router);

//middleware to serve static files
app.use(express.static('../public'));

//start the server
app.listen(3000, () => {
    console.log('App is listening on port 3000');
}); 
 