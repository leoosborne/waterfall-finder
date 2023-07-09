const express = require('express');
const app = express();

app.use(express.json());

//middleware to serve static files
app.use(express.static('../public'));
