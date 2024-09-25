import React, { useState } from "react";
import sendNotification, { showNotification } from "../service/notification";

import "./scanner.css";

const Notifications = () => {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [allergies, setAllergies] = useState("");
  const [dosage, setDosage] = useState("");
  const [okayText, setOkayText] = useState("");
  const [okayDosageText, setOkayDosageText] = useState("");
  const [interval, setInterval] = useState("");
  const categoryText = window.localStorage.getItem("CategoryText")
  const name = window.localStorage.getItem("Name")

  const checkDosage = (event) => {
    event.preventDefault();
    if (dosage > 10) {
      setOkayDosageText("It's too much!");
    } else {
      setOkayDosageText("Dosage is okay")
    }
  }

  const handleNotification = () => {
    //from browser
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setTimeout(sendNotification, interval*60**60*1000, dosage, name, interval);
      }
    });
    // from PWA
    setTimeout(showNotification, interval*60**60*1000, name + " " + dosage, interval);
    setOkayText("Notification for " + name + " created succesfully!")
  };

  return (
    <div style={{marginLeft: "10vw"}} className="container">
      <h2>Create notifications for {name}</h2>
      {categoryText !== '' ? <h3>Reminder - {categoryText}</h3> : ''}
      <div style={{marginTop: "2vh"}}> </div>
      <input 
          style={{width: "75%"}}
          type="text" 
          placeholder="Preffered dosage in gramms..."
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
      <input 
          style={{width: "75%"}}
          type="text" 
          placeholder="Preffered time interval in hours..."
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        />
      <div style={{marginTop: "2vh"}}> </div>
      <input style={{marginTop: "1vh", width: "20%", fontSize: "15px", backgroundColor: "white"}}
       type="submit" value="Create notification" onClick={handleNotification} />
       <h2>{okayText}</h2>
      <form style={{width:"90vw", margin: "auto"}} onSubmit={checkDosage}>
        <label>
          <h2>Here you can input your individual parameters:</h2>
          <input 
            style={{width: "75%"}}
            type="text" 
            placeholder="Your age..."
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <input 
           style={{width: "75%"}}
           type="text" 
           placeholder="Your height in cm..."
           value={height}
           onChange={(e) => setHeight(e.target.value)}
          />
          <input 
           style={{width: "75%"}}
           type="text" 
           placeholder="Your weight in kg..."
           value={weight}
           onChange={(e) => setWeight(e.target.value)}
          />
          <input 
           style={{width: "75%"}}
           type="text" 
           placeholder="Your allergies by comma..."
           value={allergies}
           onChange={(e) => setAllergies(e.target.value)}
          />
        </label>
        <div style={{marginTop: "2vh"}}> </div>
        <input style={{marginTop: "1vh", width: "20%", fontSize: "15px", backgroundColor: "white"}} type="submit" value="Check dosage" />
      </form>
      <h2>{okayDosageText}</h2>
    </div>
  );
};

export default Notifications;
