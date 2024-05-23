import { useState } from 'react'
import { Routes,Route, useLocation  } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import About from './components/About'
import NavbarForAdmin from './components/NavbarForAdmin'
import Navbar from './components/Navbar'
import './App.css'
import { SnackbarProvider } from 'notistack';
import Cart from './components/Cart'

function App() {
  const location = useLocation()
  const noNavbar = location.pathname === "/register" || location.pathname === "/" || location.pathname.includes("password") || location.pathname.includes("login")
  // return (
  //  <>
  //     {noNavbar? 
  //     <Routes>
  //         <Route path= "/" element={
  //           <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
  //             <Home/>
  //           </SnackbarProvider>
  //         }/>
  //         <Route path='/login' element={<Login/>}/>
  //         <Route path= "/register" element={<Register/>}/>
  //         {/* <Route path= "/request/password_reset" element={<PasswordResetRequest/>}/>
  //         <Route path= "/password-reset/:token" element={<PasswordReset/>}/> */}
  //     </Routes>:
  //     <NavbarForAdmin
  //       content = {
  //             <Routes>
  //                   <Route path= "/home" element={<Home/>}/>
  //                   <Route path= "/about" element={<About/>}/>
  //             </Routes>
  //               }/>}
  //  </>
  // )
      return (
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                  <Navbar />
                  <Routes>
                    <Route path= "/" element={<Home/>} />
                    <Route path="/cart" element={<Cart/>} />
                </Routes>
        </SnackbarProvider>
      );
  }

export default App
