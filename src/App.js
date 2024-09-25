import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import QRScanner from "./pages/Scanner";
import Stream from "./pages/Stream";
import Photo from "./pages/Photo";
import Notifications from "./pages/Notifications";

import "./App.css";
const App = () => {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/additional" element={<HomePage />}></Route>
        <Route path="/scanner" element={<QRScanner />}></Route>
        <Route path="/stream" element={<Stream />}></Route>
        <Route path="/" element={<Photo />}></Route>
        <Route path="/notifications" element={<Notifications />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
