import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import Home from "./pages/Home"
import Start from './pages/Start'
import CaptainLogin from './pages/CaptainLogin'
import UserSignup from './pages/UserSignup'
import CaptainSignup from './pages/CaptainSignup'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import Captain_Home from './pages/Captain_Home'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import CaptainContextProvider from './context/captaincontext'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start/>} />
        <Route path='/home' element={<UserProtectWrapper><Home/></UserProtectWrapper>} />
        <Route path="/captain-login" element={<CaptainLogin/>}/>
        <Route path="/usersignup" element={<UserSignup/>}/>
        <Route path="/login" element={<UserLogin/>} />
        <Route path="/signup" element={<CaptainSignup/>} />
        <Route path='riding' element={<Riding/>} />
        <Route path='/user/logout' element={<UserProtectWrapper><UserLogout/></UserProtectWrapper>} />
        <Route path='/captain-home' element={<CaptainProtectWrapper>
          <Captain_Home/></CaptainProtectWrapper>}/>
          <Route path='/captain-riding' element={<CaptainRiding/>} />
      </Routes>
    </div>
  )
}

export default App