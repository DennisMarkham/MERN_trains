import React, { useState, useEffect } from "react";
//import "./App.css";
import "./style.css";

function App() {

const [trains, setTrains] = useState([]);
const [name, setName] = useState("");
const [dest, setDest] = useState("");
const [first, setFirst] = useState("");
const [freq, setFreq] = useState();


 useEffect(() => { getTrains()}, []);

function getTrains(){
	fetch("http://localhost:8000/getTrains").then((res) => res.json()).then((data) => setTrains(data))
}

async function addTrain(){

//okay, next step.  We need to loop through the existing trains and check their names.

let canProceed = true;

for (let x of trains){
	console.log(x.name);
	if(name == x.name)
	{
		alert("cannot have multiple trains with the same name");
		canProceed = false;
	}
}

if (canProceed == true){
	let data = {
		name: name,
		dest: dest,
		first: first,
		freq: freq
	}
  try {
    const response = await fetch("http://localhost:8000/addTrain", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);

  } catch (error) {
    console.error("Error:", error);
  }

  getTrains();
}

}

async function removeTrain(trainId)
{
	let data = {
		name: trainId
	}

  try {
    const response = await fetch("http://localhost:8000/removeTrain", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }


  getTrains();
}

  return (
    <div id ="mainDiv">
    <table>
    <thead><tr><th>Train Name</th><th>Destination</th><th>Frequency</th><th>Minutes Away</th><th>Next Arrival</th></tr></thead>
 <tbody>   
{trains.map((train, index) => <tr key = {index} id = {train.name}><td>{train.name}</td><td>{train.dest}</td><td>{train.freq}</td><td>{train.away}</td><td>{train.next}</td><td><button class = 'remove' data-toggle='tooltip' data-placement='left' title='delete train' onClick ={() => removeTrain(train.name)}>x</button></td></tr>)}
  </tbody>
  </table>
<br/>
<br />
<div id = "addTrainDiv">
  Train Name: <input type="text" id="name" onChange = {(e) => setName(e.target.value)}/>
  <br/>
  <br/>
  Destination: <input type = "text" id="dest" list = "cities" onChange ={(e) => setDest(e.target.value)} />
   <datalist id = "cities">
     <option value = "New York"/>
      <option value = "Chicago"/>
     <option value = "Austin"/>
     <option value = "London"/>
     <option value = "San Francisco"/>
     <option value = "Berlin"/>
      <option value = "Munich"/>
     <option value = "Tokyo"/>
   </datalist>
  <br/>
  <br/>
  First Train Time (HH:mm am/pm): <input type="text" id="first" placeholder = "(ex. 8:45 pm)" onChange = {(e) => setFirst(e.target.value)}/>
  <br/>
  <br/>
  Frequency: Min <input type = "text" id = "freq" style = {{width:"50px"}} onChange = {(e) => setFreq(e.target.value)}/>
  <br/>
  <br/>
  <button data-toggle="tool-tip" title="add train" onClick = {() => addTrain()}>Submit</button>
</div>
    </div>
  );
}

export default App;
