import React from 'react'
// import Otp from "../../components/Otp";
// import Feed from "../Farmers/Feed";
// import Login from "../../components/Login";
// import Register from "../../components/Register";
// import Booking from "../Farmers/Booking";
// import StallDetails from "../Farmers/StallDetails";
import { Route, Routes } from "react-router-dom";
import ExistingUser from './ExistingUser';
import FarmerData from './FarmerData';
import FarmersHome from './FarmersHome';
import NewUser from './NewUser';
import Outwardfarmer from './Outwardfarmer'

function Farmer() {
  return (
    <div>
        <Routes>
        <Route path="/" element={<FarmersHome/>}/>
        <Route path="/inward" element={<FarmerData/>}/>
        <Route path="/outward" element={<Outwardfarmer/>}/>
        <Route path="/newuser" element={<NewUser/>}/>
        <Route path="/existinguser" element={<ExistingUser/>}/>
        </Routes>
    </div>
  )
}

export default Farmer