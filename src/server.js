const express = require('express');
const app = express();

app.use(express.json());

let router = express.Router();

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
