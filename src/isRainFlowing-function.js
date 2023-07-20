// Function to check if rain is flowing (greater than or equal to 1 inch)
function isRainFlowing(rainData) {
    return rainData.value >= 1 ? 'Yes' : 'No';
  }
  
  // API route to get the rain flow status for each zipcode
  router.get('/rainFlowStatus', (req, res, next) => {
    try {
      let rainFlowStatus = new Map();
  
      // Use the existing rainDataMap if available
      if (historicalRainData.size > 0) {
        const latestEntry = [...historicalRainData.entries()].pop();
        const [timestamp, data] = latestEntry;
        for (let [zipcode, rainData] of data) {
          rainFlowStatus.set(zipcode, isRainFlowing(rainData));
        }
      } else {
        for (let zipcode of zipArr) {
          rainFlowStatus.set(zipcode, 'No data');
        }
      }
  
      res.send({ "rainFlowStatus": Array.from(rainFlowStatus) });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });