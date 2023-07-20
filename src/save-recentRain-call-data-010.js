// Handle the initial request for recent rain data
router.get('/recentRain', (req, res, next) => {
    try {
      let rainDataMap = new Map();
  
      // Use the existing rainDataMap if available
      if (historicalRainData.size > 0) {
        const latestEntry = [...historicalRainData.entries()].pop();
        const [timestamp, data] = latestEntry;
        for (let zipcode of zipArr) {
          rainDataMap.set(zipcode, data.find(entry => entry[0] === zipcode)[1]);
        }
      } else {
        for (let zipcode of zipArr) {
          rainDataMap.set(zipcode, { "value": "No data", "unit": "" });
        }
      }
  
      res.send({ "rainDataMap": Array.from(rainDataMap) });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  