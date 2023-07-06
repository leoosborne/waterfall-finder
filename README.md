# waterfall-finder
Website that uses weather and mapping APIs to determine when intermittent waterfalls are flowing. 
## Project Brief
Build a responsive website that combines a map of Mammoth Cave National Park waterfalls with recent rainfall levels and runs calculations on the data  to highlight the best times to visit and see the waterfalls flowing.

Project will create functions that
1. Show whether a waterfall is currently flowing.
2. Show how long the flow is estimated to last.
3. Show a 5-day forecast for the park, so users can plan a visit while the waterfalls are flowing.

## Project Requirements
1. "Use arrays, objects, sets or maps to store and retrieve information that is displayed in your app."
    - [ ] Retrieve data from the accuweather  API (to be used in the function below), and store in maps.
    - [ ] How much rain has fallen for the past hour as measured by the closest weather provider.

2. "Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app."

    - [ ] Create a function or functions that calculate whether enough rain has fallen over a certain time to activate the waterfalls and, if so, how long the waterfall should remain active. 
    - [ ] The function(s) take the following three arguments, based on best estimates:
        - [ ] Hourly rainfall in area  
        - [ ] Time frame to search (12, 24, 36, 48 hours)
        - [ ] Approximate time falls flow after one inch of rainfall

3. "Visualize data in a user friendly way. (e.g. graph, chart, etc.)."

    - [ ] Using Chart.js, show how much rain has fallen per hour over the past five days.
    - [ ] Using the function, show the approximate time that waterfalls will be flowing.
  

4. "Retrieve data from a third-party API and use it to display something within your app."
    - [ ] Historic area rainfall for the past 1 hour useing the Accuweather API.
    - [ ] Location of waterfalls and size of watershed using LiDAR map layer (source TBD) and Google Earth API. 
    - [ ] Five day forecast for the location of the waterfalls using Accuweather API.

5. "Create a node.js web server using a modern framework such as Express.js or Fastify.  Serve at least one route that your app uses."

    - [ ] Create a server with Node.js and Express.js.
    - [ ] Use local storage to save JSON data from APIs and function returns.
    - [ ] Use vanilla JavaScript for the client and server side scripting.


## Technical Description
The project will be a responsive multi-page application (MPA) built either with MongoDB, Express, ReactJS and Node.js, or with vanilla JavaScript if I cannot grok React within the alloted time. My research pointed me to this setup because I want the following features.

    1. Ability to add Google Analytics.
    2. Ability to track SEO for the different pages.
    3. Will add an e-commerce platform to sell prints.
    4. Want users to embed these pages in their websites.

## Visualizations
1. Wireframes in Figma: https://bit.ly/3NsFo10, https://bit.ly/3DjWiup
2. Color Pallete in html: resources > colors.html
3. Font styles and sizes in Figma: [to come]
