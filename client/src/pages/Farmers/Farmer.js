import React from 'react'
import { Route, Routes } from "react-router-dom";
import FarmerData from './FarmerData';
import FarmersHome from './FarmersHome';
import Outwardfarmer from './Outwardfarmer'
import Register from '../../components/Register'
import Login from '../../components/Login'

function Farmer() {
  return (
    <div>
        <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/inward" element={<FarmerData/>}/>
        <Route path="/outward" element={<Outwardfarmer/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/farmershome" element={<FarmersHome/>}/>
        </Routes>
    </div>
  )
}

export default Farmer