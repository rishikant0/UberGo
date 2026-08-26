import React from "react";
import { Route, Routes } from "react-router-dom";

import UserLogin from "./pages/UserLogin";
import Home from "./pages/Home";
import Start from "./pages/Start";
import CaptainLogin from "./pages/CaptainLogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import UserLogout from "./pages/UserLogout";
import Captain_Home from "./pages/Captain_Home";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import FinishRide from "./components/FinishRide";

const App = () => {
  return (
    <div>
      <Routes>

        {/* START */}
        <Route path="/" element={<Start />} />

        {/* USER ROUTES */}
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          }
        />

        <Route path="/login" element={<UserLogin />} />
        <Route path="/usersignup" element={<UserSignup />} />

        <Route
          path="/user/logout"
          element={
            <UserProtectWrapper>
              <UserLogout />
            </UserProtectWrapper>
          }
        />

        <Route path="/riding" element={<Riding />} />
        <Route path="/finish-ride" element={<FinishRide />} />

        {/* CAPTAIN ROUTES */}

        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/signup" element={<CaptainSignup />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />

        <Route
          path="/captain-home"
          element={
            <CaptainProtectWrapper>
              <Captain_Home />
            </CaptainProtectWrapper>
          }
        />

        {/* 🔥 PROTECTED CAPTAIN RIDING PAGE */}
        <Route
          path="/captain-riding"
          element={
            <CaptainProtectWrapper>
              <CaptainRiding />
            </CaptainProtectWrapper>
          }
        />

      </Routes>
    </div>
  );
};

export default App;
