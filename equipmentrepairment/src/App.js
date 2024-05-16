import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import HomePage from './Components/HomePage/HomaPage';
import EquipmentPage from './Components/EquipmentPage/EquipmentPage';
import QualityControlPage from './Components/QualityControlPage/QualityControlPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/certification-services" element={<EquipmentPage />} />
          <Route path="/quality-control" element={<QualityControlPage />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;