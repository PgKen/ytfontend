import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Login from './components/Login';
import Home from './components/Home'; // Uncomment if you have a Home component
import InputPrice from './components/Inputprice'; // Uncomment if you have an InputPrice component
import Showprice from './components/Showprice'; // Uncomment if you have a Showprice component

import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inputprice" element={<InputPrice />} />
        <Route path="/showprice" element={<Showprice />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;