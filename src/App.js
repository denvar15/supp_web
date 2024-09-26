import React, { useState, useEffect } from "react";
import { Grommet } from 'grommet';

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Cart from "./pages/Cart";
import Photo from "./pages/Photo";
import Notifications from "./pages/Notifications";

const theme = {
  global: {
    font: {
      family: "Oxygen",
      size: "18px",
      height: "20px",
    },
    select: {
      background: "black"
    },
    drop: {
      background: "black"
    }
  },
};

const App = () => {


  return (
    <Grommet theme={theme} style={{backgroundColor: "black", color: "white"}} full>
      <BrowserRouter>
        <Routes>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/" element={<Photo />}></Route>
          <Route path="/notifications" element={<Notifications />}></Route>
        </Routes>
      </BrowserRouter>
    </Grommet>
  );
};

export default App;
