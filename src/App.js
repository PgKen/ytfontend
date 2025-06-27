import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Login from './components/Login';
import Home from './components/Home'; // Uncomment if you have a Home component
import InputPrice from './components/Inputprice'; // Uncomment if you have an InputPrice component
import Showprice from './components/Showprice'; // Uncomment if you have a Showprice component
import Uploadimg from './components/Uploadimg';
import Prompt from './components/Prompt';
import Compareprices from './components/Compareprices';
import VegetablePriceChart from './components/VegetablePriceChart';
import Insertdata from './components/Insertdata';
import Showproductconf from './components/Showproductconf';

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
        <Route path="/uploadimg" element={<Uploadimg />} />
        <Route path="/prompt" element={<Prompt />} />
        <Route path="/compareprices" element={<Compareprices />} />
        <Route path="/vegetable-chart" element={<VegetablePriceChart data={[]} />} />
        <Route path="/insertdata" element={<Insertdata />} />
        <Route path="/showproductconf" element={<Showproductconf />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;