import { FunctionComponent, ReactNode, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Footer, Header } from './components';
import Sidebar from './components/Sidebar'
import './App.css';
import { GlobalStyle } from './config/theme';
import { ToggleThemeContext } from './Root';

import React,{useState} from 'react';
import Chat from './components/Chat'
import { BrowserRouter , Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Midbar from './components/Midbar';
import { Box } from '@mui/system';
import Login from './pages/Login';
import Home from './pages/Home';
import Sample from './components/Sample';

export type AppProps = {
  children: ReactNode;
};
//children renders index.ts otherwise it wont be rendered

export const App: FunctionComponent<AppProps> = ({ children }) => {
  const toggleTheme = useContext(ToggleThemeContext);
  

const [accessToken,setAccessToken] =useState(null);

const setToken=()=>{
  localStorage.getItem("access_token") !== undefined
  ? setAccessToken(localStorage.getItem("access_token")):
  setAccessToken(null)
}
const removeToken=()=>{
  setAccessToken(null);
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}
useEffect(()=>{
  console.log('App.tsx rendering')
  setToken()
})
 
  return (
    <div >
      <GlobalStyle />
      <BrowserRouter>
      <Routes>
      <Route  path="/home/*" element={<Home children={children} toggleTheme={toggleTheme}  accessToken={accessToken}  removeToken={removeToken}/>}>
        </Route>
        <Route path='/' element={<Login setToken={setToken} removeToken={removeToken} accessToken={accessToken}/>}/>
        <Route path='/sample' element={<Sample/>}/>
        
      </Routes>
      </BrowserRouter>
    </div>
  );
};
