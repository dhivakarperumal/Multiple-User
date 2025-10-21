import { useState } from 'react'
import './App.css'
// import AddProducts from './Componets/AddProducts'
import { Outlet } from 'react-router-dom'
import Navbars from './Componets/Navbar/Header'
// import Products from './Componets/Products'
// import ProductDetails from './Componets/ProductDetails'
// import Registers from './Componets/Register';
// import Login from './Componets/Login';
// import Navbar from './Componets/Navbar/Header'
import Footer from './Componets/Navbar/Footer'
// import Home from './Componets/Home'

import { Toaster } from "react-hot-toast";

function App() {


  return (
    <>
     <Toaster position="top-center" reverseOrder={false} />
      <div>
        <Navbars/>
        <Outlet/>
        <Footer/>
        
       </div>
    </>
  )
}

export default App
