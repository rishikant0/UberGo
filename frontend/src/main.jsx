import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from "./context/usercontext";
import CaptainContextProvider from "./context/captaincontext.jsx";
import SocketContextProvider from "./context/socketContext.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketContextProvider>
      <CaptainContextProvider>
        <UserContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContextProvider>
      </CaptainContextProvider>
    </SocketContextProvider>
  </StrictMode>,
)
