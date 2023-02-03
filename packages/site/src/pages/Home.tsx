import { FunctionComponent, ReactNode, useContext, useEffect} from 'react';
import styled from 'styled-components';
import { Footer, Header } from '../components';
import Sidebar from '../components/Sidebar'
import '../App.css';
import { GlobalStyle } from '../config/theme';
import { ToggleThemeContext } from '../Root';

import React,{useState} from 'react';
import Chat from '../components/Chat'
import { BrowserRouter , Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Index from'./index'
import Midbar from '../components/Midbar';
import { Box } from '@mui/system';
import Login from '../pages/Login';
import axios from 'axios';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

const Home=({ children ,accessToken,toggleTheme,removeToken}:any)=> {
    const navigate= useNavigate();
    const[rooms,setRooms]= useState([
  ]);
    const getGroup=async()=>{
      try{
      const res=await axios.get(
        'https://knotty-calendar-production.up.railway.app/group',
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}` 
            }
      })
        const data=res.data;
        console.log('Data',data)
        console.log('Rooms', rooms)
        let reset=false;
        if(data.length!==rooms.length)
        {
          reset=true;
        }
       
        if(reset)
        {
          console.log('Data unequal')
          setRooms(data)
        }
          
        }
      catch(err)
      {
        console.log(err);
      }
  }
    useEffect(()=>{
        alert('Home rerendering')
       
        if(!localStorage.getItem("access_token"))
            {
            removeToken()
            navigate('/')
            }
        
       
    },)
   useEffect(()=>{
    getGroup()
   },)
  return (
    <Wrapper>
    <Header handleToggleClick={toggleTheme} />
    <Box display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh" >
    <div className="chat__body">
    <Sidebar rooms={rooms} access={accessToken}/>
    <Routes>
            <Route  path="rooms/:roomId" element={<Midbar rooms={rooms} access={accessToken}/>}/>
            <Route  path="rooms/:roomId/transacts/:transactid" element={<Chat rooms={rooms}  access={accessToken}/>}/>
    </Routes>
    </div>
    </Box>
    <Index/>{/** wassnt initially there */}
  
  {/*{children} for proab rendering index*/ }
      <Footer />
      
    </Wrapper>
 
  )
}
export default Home;
