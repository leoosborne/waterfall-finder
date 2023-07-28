# waterfall-finder
Website that uses weather and mapping APIs to determine when intermittent waterfalls are flowing. 
## Project Brief
Build a responsive website that combines a map of Mammoth Cave National Park waterfalls with recent rainfall levels and runs calculations on the data  to highlight the best times to visit and see the waterfalls flowing.

Project will create functions that
1. Show whether a waterfall is currently flowing.
2. Show how long the flow is estimated to last.

## Project Requirements
1. "Use arrays, objects, sets or maps to store and retrieve information that is displayed in your app."
    - [yes] Retrieve data from the AccuWeather API (to be used in the function below), and store in maps.
    - [yes] How much rain has fallen for the past 24 hours as measured by the closest weather provider.

2. "Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app."

    - [yes] Create a function or functions that calculate whether enough rain has fallen over a certain time to activate the waterfalls and, if so, how long the waterfall should remain active. 

3. "Visualize data in a user friendly way. (e.g. graph, chart, etc.)."

    - [yes, but hard coded] Using Chart.js, show how much rain has fallen per hour over the past five days.
    - [future] Using the function, show the approximate time that waterfalls will be flowing.
  

4. "Retrieve data from a third-party API and use it to display something within your app."
    - [yes] Historic area rainfall for the past 24 hours using the Accuweather API.
    - [hard coded, dynamic in future] Location of waterfalls and size of watershed using LiDAR map layer (source TBD) and Google Earth API. 
    - [maybe, in future] Five day forecast for the location of the waterfalls using Accuweather API.

5. "Create a node.js web server using a modern framework such as Express.js or Fastify.  Serve at least one route that your app uses."

    - [yes] Create a server with Node.js and Express.js.
    - [future] Use local storage to save JSON data from APIs and function returns.
    - [yes] Use vanilla JavaScript for the client and server side scripting.


## Technical Description
The first iteration of the project will be a responsive single-page application built with Express, vanilla javascript and Node.js. Eventually it will become a Multi-Page Application. My research pointed me to this setup because I want the following features...

    1. Ability to add Google Analytics.
    2. Ability to track SEO for the different pages.
    3. Will add an e-commerce platform to sell prints.
    4. Want users to embed these pages in their websites.

## Visualizations
1. Wireframes in Figma: https://bit.ly/3NsFo10, https://bit.ly/3DjWiup
2. Color Pallet in html: resources > colors.html
3. Font styles and sizes in Figma: [to come]


## Instructions 

1. clone the git repo onto your computer
2. cd into the src file (where package.json is)
3. run “npm install” (to add a new node_modules)
4. run “npm install dotenv” (to replace the current dotenv. this might not be necessary if dotenv already exists in node_modules folder)
5. create a new file called .env in the same directory as package.json
6. create a new environment variable for the API Key in .env file (ACCUWEATHER_API_KEY = “K1F3i99Hrjs6JGPe9fjMpAeZbrGdOkYb”)
7. check server.js line 25 that the variable in the fetch call to api is this: ${process.env.ACCUWEATHER_API_KEY};
8. On line 44 in server.js, update the cron.schedule to one minute in the future to trigger the API call to AccuWeather. The first number is minutes, the second number is hours in 24 hour scale ("military time"). Example, if you are reviewing this project at 1:30pm, set the code to '31 13 * * *' to trigger the API call at 1:31pm.
9. start the dev server (“npm run debug”)
10. open a new browser window (localhost:3000)
11. Project should run successfully. 
12. Check the table under the heading "Are the Falls Flowing Now?". Rain Data from the last 24 hours will populate the table row "Rainfall total yesterday". In "Are the Falls Flowing" table row, a function checks to see if 1 inch or more of rain fell yesterday (starting at mid-night the day before). Yes or No are printed depending upon this function. 
13. If you see "no data" in either of these lines, repeat steps 8 - 10 to make sure that the API call fires correctly. 
