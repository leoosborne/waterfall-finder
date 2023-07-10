const express = require('express');
const app = express();

app.use(express.json());

//middleware to serve static files
app.use(express.static('../public'));

//start the server
app.listen(3000, () => {
    console.log('App is listening on port 3000');
}); 
