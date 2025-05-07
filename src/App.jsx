import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import Shop from "./pages/Shop";
import Login from "./components/Login";
import Mydesign from "./pages/Mydesign";
import Design2d from "./pages/Design2d";
import Library from "./pages/Library";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route index path="/" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mydesign" element={<Mydesign />} />
        <Route path="/design2d" element={<Design2d />} />
        <Route path="/library" element={<Library />} />

        {/*
        <Route path="/login" element={<Login />} />
        <Route path="/mydesign" element={<Mydesign />} /> */}
      </Routes>
    </>
  );
}

export default App;
