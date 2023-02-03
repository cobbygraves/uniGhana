import React, { useState, Suspense } from 'react'
import './App.css'
import { Typography } from '@mui/material'
import SignIn from './components/SignIn/SignIn'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthContext from './context/AuthContext'
import SignUp from './components/SignUp/SignUp'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className='App'>
      <AuthContext.Provider
        value={{ userAuth: isLoggedIn, setUserAuth: setIsLoggedIn }}
      >
        <BrowserRouter>
          <Suspense
            fallback={
              <Typography sx={{ textAlign: 'center' }}>
                loading please wait...
              </Typography>
            }
          >
            <Routes>
              <Route path='/' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  )
}

export default App
