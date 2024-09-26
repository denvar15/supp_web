import React, { useState } from "react";
import { Heading, Text, List, Button, Grid } from 'grommet';
import { useNavigate } from "react-router";
import { Shop } from 'grommet-icons';

const Cart = () => {
  const navigate = useNavigate();
  let items = JSON.parse(window.localStorage.getItem("scannedItems")) ? JSON.parse(window.localStorage.getItem("scannedItems")) : [];
  items = items.reverse()

  return (
    <div>
      <Text style={{fontSize: "25px", fontWeight: "750", display: "block", border: "1.5px solid rgb(125, 76, 219)",
                 padding: "10px", color: "rgb(111, 255, 176)", borderRadius: "5px", textAlign: "center"}}>
        Supplement <Text style={{fontSize: "25px", fontWeight: "750", color: "white"}}>Assistant</Text>
      </Text>
      <Heading style={{display: "block", marginLeft: "10vw", color: "rgb(111, 255, 176)"}}>
        History of your <Heading style={{display: "inline", color: "white"}}>scans</Heading>
      </Heading>

      <List
      pad="medium"
        primaryKey={(data) => <Text style={{fontSize: "20px", fontWeight: "750", 
                  color: "rgb(111, 255, 176)"}}>{data['name']}</Text>}
        secondaryKey={(data) => <Text style={{fontSize: "15px"}}>{'Quality check found - '} {data['quality'].length ? data['quality'] : "nothing. "} Harmful components found - 
          {data['harmful'].length ? data['harmful'] : " nothing."} From category {data['category'][0]} found - {data['category'][1].length ? data['category'][1] : "nothing."}</Text>}
        data={items}
      />

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

export default Cart;
