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
import Route1Page from './pages/Route1Page';
import Route2Page from './pages/Route2Page';
import Route3Page from './pages/Route3Page';

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
const removeToken=async()=>{
  
  await localStorage.removeItem('access_token')
  await localStorage.removeItem('refresh_token')
  setAccessToken(null);
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
      <Route path='/' element={<Login setToken={setToken} removeToken={removeToken} accessToken={accessToken}/>}/>
      <Route  path="/home/*" element={<Home children={children} toggleTheme={toggleTheme}  accessToken={accessToken}  removeToken={removeToken}/>}>
        </Route>
       
        <Route path='/sample' element={<Sample/>}/>
        <Route  path='/route1'  element={<Route1Page toggleTheme={toggleTheme} setToken={setToken} removeToken={removeToken} accessToken={accessToken}/>}/>
        <Route  path='/route2' element={<Route2Page toggleTheme={toggleTheme} setToken={setToken} removeToken={removeToken} accessToken={accessToken}/>}/>
        <Route  path='/route3' element={<Route3Page toggleTheme={toggleTheme} setToken={setToken} removeToken={removeToken} accessToken={accessToken}/>}/>
      </Routes>
      {/* <Footer /> */}
      
    
      </BrowserRouter>
    </div>
  );
};
