const fs = require('fs');
const fetch = require('node-fetch'); // Assuming you have the node-fetch library installed

fetch('https://example.com/api/data')
  .then(response => response.json())
  .then(data => {
    // Convert the data to a JSON string
    const jsonData = JSON.stringify(data);

    // Write the JSON string to the file
    fs.writeFile('rain_data.json', jsonData, 'utf8', err => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Data written to file successfully.');
      }
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
