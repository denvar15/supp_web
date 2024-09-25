import React, { useState } from "react";
import sendNotification, { showNotification } from "../service/notification";
import { Heading, Text, Select, TextInput, Button } from 'grommet';

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
    <div>
      <Text style={{fontSize: "25px", fontWeight: "750", display: "block", border: "3px solid rgb(125, 76, 219)",
                 padding: "10px", color: "rgb(111, 255, 176)", borderRadius: "5px", textAlign: "center"}}>
        Supplement <Text style={{fontSize: "25px", fontWeight: "750", color: "white"}}>Assistant</Text>
      </Text>
      <Heading style={{display: "block", marginLeft: "10vw", color: "rgb(111, 255, 176)"}}>
        Create notifications for <Text style={{fontSize: "50px", color: "white"}}>{name}</Text>
      </Heading>
        <Text style={{fontSize: "25px", display: "block", fontWeight: "750", color: "white", marginLeft: "10vw"}}>
            Here you can create scheduled <Text style={{fontSize: "25px", color: "rgb(111, 255, 176)"}}>notification</Text> about your supplement:
        </Text>
        <div style={{marginTop: "2vh"}}> </div>
        {categoryText !== '' ? <Text style={{fontWeight: "750", color: "rgb(125, 76, 219)", marginLeft: "10vw"}}>Reminder - {categoryText}</Text> : ''}
        <div style={{marginTop: "2vh"}}> </div>
        <TextInput 
          style={{width:"80vw", marginLeft: "10vw", marginBottom: "2vh",
            borderWidth: "1px", borderColor: "rgb(125, 76, 219)"
          }}
          type="text" 
          placeholder="Preffered dosage in gramms..."
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
        <TextInput 
          style={{width:"80vw", marginLeft: "10vw", marginBottom: "2vh",
            borderWidth: "1px", borderColor: "rgb(125, 76, 219)"
          }}
          type="text" 
          placeholder="Preffered time interval in hours..."
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          />
      <Button primary style={{fontWeight: "750", marginLeft: "10vw", padding: "10px"}} onClick={handleNotification}>Create notification</Button>
      {okayText !== '' ? 
      <div><div style={{marginTop: "2vh"}}> </div><Text style={{fontWeight: "750", color: "white", marginLeft: "10vw"}}>{okayText}</Text></div> : ''}
      <div style={{marginTop: "7vh"}}> </div>
      <form onSubmit={checkDosage}>
        <label>
          <Text style={{fontSize: "25px", display: "block", fontWeight: "750", color: "white", marginLeft: "10vw"}}>
            Here you can input your <Text style={{fontSize: "25px", color: "rgb(111, 255, 176)"}}>individual</Text> parameters:
          </Text>
          <div style={{marginTop: "2vh"}}> </div>
          <TextInput 
          style={{width:"80vw", marginLeft: "10vw", marginBottom: "2vh",
            borderWidth: "1px", borderColor: "rgb(125, 76, 219)"
          }}
          type="text" 
          placeholder="Your age..."
          value={age}
          onChange={(e) => setAge(e.target.value)}
          />
          <TextInput 
          style={{width:"80vw", marginLeft: "10vw", marginBottom: "2vh",
            borderWidth: "1px", borderColor: "rgb(125, 76, 219)"
          }}
          type="text" 
          placeholder="Your height in cm..."
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          />
          <TextInput 
          style={{width:"80vw", marginLeft: "10vw", marginBottom: "2vh",
            borderWidth: "1px", borderColor: "rgb(125, 76, 219)"
          }}
          type="text" 
          placeholder="Your weight in kg..."
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          />
          <TextInput 
          style={{width:"80vw", marginLeft: "10vw", marginBottom: "2vh",
            borderWidth: "1px", borderColor: "rgb(125, 76, 219)"
          }}
          type="text" 
          placeholder="Your allergies by comma..."
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          />
        </label>
        <Button type="submit" primary style={{marginLeft: "10vw", padding: "10px", color: "black",
          fontWeight: "750", backgroundColor: "rgb(111, 255, 176)"}} onClick={checkDosage}>Check dosage</Button>
      </form>
      <div style={{marginTop: "2vh"}}> </div>
      {okayDosageText !== '' ? 
      <div><Text style={{fontSize: "25px", fontWeight: "750", color: "rgb(125, 76, 219)", marginLeft: "10vw"}}>{okayDosageText}</Text></div> : ''}
    </div>
  );
};

export default Notifications;
