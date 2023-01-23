const express=require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const request=require('request');
const path=require('path');
const publicPath=path.join(__dirname,"public");
app.use(express.static(publicPath));
app.set('view engine','ejs');
const randomCities=["Texas","Gothenburg","Delhi","Chennai","Hyderabad"];
app.get("/",(req,res)=>{

    const location=randomCities[Math.floor(Math.random()*randomCities.length)];
    const url=`http://api.weatherapi.com/v1/forecast.json?key=5d6e85404b024ada8e8134834201910&q=${location}&days=1&aqi=yes&alerts=no`
    console.log(url);
    request(url,(err,resp,body)=>{
        const parsedData=JSON.parse(body);
        // res.send(typeof body);
        // console.log(parsedData);
        const weatherData={tempC: parsedData.current.temp_c,tempF: parsedData.current.temp_f, 
        condition: parsedData.current.condition.text,
        windkmph: parsedData.current.wind_kph,
        locName: parsedData.location.name,
        locRegion: parsedData.location.region,
        localtime: parsedData.location.localtime
        };
        // console.log("weatherData",weatherData)
        res.render("home",{locs: [parsedData.location.lon, parsedData.location.lat], data: weatherData})
    })
    // const weatherData={tempC: null,tempF: null, condition: null,
    //     windkmph: null,
    //     locString: null,
    //     localtime: null
    //     };
    // res.render('home',{locs:[25,53.4],data: weatherData});
})

app.post("/",function(req,res){
    // console.log(req.body);
    const location=req.body.location;

    const url=`http://api.weatherapi.com/v1/forecast.json?key=5d6e85404b024ada8e8134834201910&q=${location}&days=1&aqi=yes&alerts=no`
    console.log(url);
    request(url,(err,resp,body)=>{
        const parsedData=JSON.parse(body);
        if(parsedData["error"])
        {
            res.redirect("/");
            return;
        }
        // res.send(typeof body);
        // console.log(parsedData);
        const weatherData={tempC: parsedData.current.temp_c,tempF: parsedData.current.temp_f, 
        condition: parsedData.current.condition.text,
        windkmph: parsedData.current.wind_kph,
        locName: parsedData.location.name,
        locRegion: parsedData.location.region,
        localtime: parsedData.location.localtime
        };
        // console.log("weatherData",weatherData)
        res.render("home",{locs: [parsedData.location.lon, parsedData.location.lat], data: weatherData})
    })
});
const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server started!");
})