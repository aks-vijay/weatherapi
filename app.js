// require modules
const express = require("express");
const https =  require("https");
const path = require("path");
const bodyParser = require("body-parser")

// initilize express
const app = express();

// use body parser
app.use(bodyParser.urlencoded({extended: true}));

// GET 
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));

})

// POST
app.post("/", function(req, res) {
    const query = req.body.city;

    const apiKey = "6a29894ea401690401bbc6b91949726d";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

    https.get(url, function(response) {
        
        // log the status code once client responded
        console.log("Status code: " + response.statusCode);

        response.on("data", function(data) {
            
            // parse the response to JSON
            const weatherData = JSON.parse(data);
            
            // tap in required data from the parsed JSON
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            
            // display to the client
            res.type("html")
            res.write("<img src='" + iconUrl +"'>")
            res.write("<p>The weather is currently " + weatherDescription + "</p>")
            res.write("<h1>The temperature in "+ query +" is: " + temp + " degree celesius.</h1>")
            res.send();
    })
})
})

// listen to port
const port = 3000;
app.listen(port, function() {
    console.log(`Server started at port ${port}...`);
})