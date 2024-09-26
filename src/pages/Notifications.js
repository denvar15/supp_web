import React, { useState } from "react";
import sendNotification, { showNotification } from "../service/notification";
import { Heading, Text, TextInput, Button, Grid } from 'grommet';
import { useNavigate } from "react-router";
import { Shop } from 'grommet-icons';

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
  const navigate = useNavigate();

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
        setTimeout(sendNotification, interval*60*60*1000, dosage, name, interval);
      }
    });
    // from PWA
    setTimeout(showNotification, interval*60*60*1000, dosage, interval, name);
    setOkayText("Notification for " + name + " created succesfully!")
  };

  return (
    <div>
      <Text style={{fontSize: "25px", fontWeight: "750", display: "block", border: "1.5px solid rgb(125, 76, 219)",
                 padding: "10px", color: "rgb(111, 255, 176)", borderRadius: "5px", textAlign: "center"}}>
        Supplement <Text style={{fontSize: "25px", fontWeight: "750", color: "white"}}>Assistant</Text>
      </Text>
      <Heading style={{display: "block", marginLeft: "10vw", color: "rgb(111, 255, 176)"}}>
        Create notifications for <Heading style={{display: "inline", color: "white"}}>{name}</Heading>
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
      <div  style={{display: "block"}}><div style={{marginTop: "2vh"}}> </div>
      <Text style={{display: "block", fontWeight: "750", color: "white", marginLeft: "10vw"}}>{okayText}</Text></div> : ''}
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

      <div style={{marginTop: "3vh"}}> </div>
      
      <Grid
        rows={['auto', 'auto']}
        columns={['2/4', '2/4']}
        gap="none"
        areas={[
          { name: 'nav', start: [0, 1], end: [0, 1] },
          { name: 'main', start: [1, 1], end: [1, 1] },
        ]}
      >
        <Button gridArea="main" type="submit" primary style={{ padding: "10px", fontWeight: "750"}} 
          onClick={() => navigate("/", {replace: true})}>Back to Photo</Button>
        <div gridArea="nav"> </div>
      </Grid>

      <div style={{marginTop: "2vh"}}> </div>

      <Grid
        rows={['auto', 'auto']}
        columns={['2/4', '2/4']}
        gap="none"
        style={{borderRadius: "5px", border: "1px solid rgb(125, 76, 219)"}}
        areas={[
          { name: 'nav', start: [0, 1], end: [0, 1] },
          { name: 'main', start: [1, 1], end: [1, 1] },
        ]}
      >
        <Text onClick={() => navigate("/cart", {replace: true})}
            gridArea="nav" style={{fontSize: "20px", fontWeight: "750", display: "inline-block", cursor: "pointer",
              padding: "10px", color: "rgb(111, 255, 176)", border: "1px solid rgb(125, 76, 219)"}}>
          <Shop color='white' size='medium' style={{marginRight: "5px"}} /> 
          Supplement's <Text style={{fontSize: "20px", fontWeight: "750", color: "white"}}>Cart</Text>
        </Text>
        <Text gridArea="main" style={{fontSize: "20px", textAlign: "end", fontWeight: "650", display: "inline-block",
                  padding: "10px", border: "1px solid rgb(125, 76, 219)"}}>
                  Our telegram: @supchecker_bot  
        </Text>
      </Grid>
    </div>
  );
};

export default Notifications;
