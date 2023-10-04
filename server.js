require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
const moment = require("moment");

//it says this mongoURI variable is not a string.  What?
mongoose.connect(mongoURI);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//app.use(cors());
//app.use(express.json());

const schema = new mongoose.Schema({
	name: String,
	dest: String,
	first: String,
	freq: Number
});

//that "Trains1" error was really weird, I'd think I'd have copied that code AFTER chaning the name of the
//"Trains1" model.  Glitch in the Matrix?
//Oh wait, no, everything was "Trains1" in the place I copied it from.  See, the Matrix is fine.


const Trains = mongoose.model("Train", schema);


app.get("/getTrains", function(req, res){
	async function getTrains(){
    await Trains.find({}).then((data) =>
    {
    //okay, so data is an array, so processed data needs to an array too.
    let processedData = [];

    //this for loop should loop data
    for (let x of data)
    {
    let first = x.first;

    //now we just need some way to process "next", and "minutes way" right here.

  //This is the value for the time difference between now and the first arrival:
    let diffTime = moment().diff(moment(first, "HH:mm a"), "minutes");

    console.log("Diff time: " + diffTime);

    let nextTrain = 0;
    let tMinutesTillTrain = 0;
    let tRemainder = 0;

    if (diffTime >= 0)
    {
    	tRemainder = diffTime % x.freq;
    	tMinutesTillTrain = x.freq - tRemainder;
    	nextTrain = moment().add(tMinutesTillTrain, "minutes");
    }
    else
    {
    	//I'm don't think this is actually ever used because there's no "last train" so trains run 24/7,
    	//but if I ever implement last trains this will be useful.
    	nextTrain = first;
    	away = Math.abs(diffTime);
    }

    let processedDataObj = {
    name: x.name,
    dest: x.dest,
    freq: x.freq,
    next: moment(nextTrain).format("hh:mm a"),
    away: tMinutesTillTrain
    }

    processedData.push(processedDataObj); 
}

    res.json(processedData);
})
	}

getTrains();
})

app.post("/removeTrain", function(req, res){
//why does this come back undefined
console.log(req.body.name);

async function removeTrain(){
await Trains.deleteOne({name: req.body.name}).then(() => console.log("train deleted"))
}

removeTrain();

res.sendFile(__dirname + "/index.html")
})


app.post("/addTrain", function(req, res){
console.log(req.body)

async function addTrain(){
let newTrain = new Trains(
	{
	name: req.body.name,
	dest: req.body.dest,
	first: req.body.first,
	freq: req.body.freq
}
)

await newTrain.save();

//this works nicely enough...I guess...
res.sendFile(__dirname + "/index.html")
}

addTrain();

})


app.listen(8000);