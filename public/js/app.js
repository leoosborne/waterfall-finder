'use strict';

let accumulatedRainData = new Map();
// after the accuweather API call in server.js, this updates the daily rainfall data (value and unit) for each zip code
fetch('api/recentRain')
    .then(response => response.json())
    .then((data) => {
        let rainDataMap = data.rainDataMap;
        for (let [zipcode, rainData] of rainDataMap) {
            document.getElementById(zipcode.toString()).textContent = rainData.value + " " + rainData.unit;
            accumulatedRainData[zipcode] = rainData; // Store the rainData in the accumulatedRainData object
            console.log(rainDataMap);//shows zipcode(s) in console of localhost:3000
        }
    })
    .catch(error => {
        console.error(error);
        // Handle the error
    });

// Function to fetch historical rain data
async function fetchHistoricalRainData() {
    try {
        const response = await fetch('/api/historicalRain');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching historical rain data:', error);
        return [];
    }
}

  // Async/Await Function to fetch rain flow status
  async function fetchRainFlowStatus() {
    try {
      const response = await fetch('/api/rainFlowStatus');
      const data = await response.json();
      return data.fallsFlowMap;
      console.log(data);//cannot find this console.log
    } catch (error) {
      console.error('Error fetching rain flow status:', error);
      return [];
    }
  }

  // Promise function to fetch rain flow status
  // fetch('/api/rainFlowStatus')
  //   .then(response => response.json)
  //   .then(data => {
  //     let rainFlowStatus = data.rainFlowStatus;
  //     for (let [zipcode, rainData] of rainFlowStatus) {
  //       document.getElementById(zipcode.toString()).textContent = rainData.rainFlowStatus;
  //       console.log(rainData.rainFlowStatus);
  //     }
  //   })
  //     .catch(error => { 
  //         console.error(error);
  //         // Handle the error
  //   });

  // Function to update the rain flow status in the table; updated code
function updateRainFlowStatus(rainFlowStatus) {
    console.assert(Array.isArray(rainFlowStatus));
    rainFlowStatus.forEach(([zipcode, status]) => {
      const rowId = `${zipcode}-is-flowing`;
      document.getElementById(rowId).textContent = status;
    });
  }

    // On page load, fetch and update rain flow status
    document.addEventListener('DOMContentLoaded', async () => {
        const rainFlowStatus = await fetchRainFlowStatus();
        updateRainFlowStatus(rainFlowStatus);
      });
    

