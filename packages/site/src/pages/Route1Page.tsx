import React, { useEffect, useState } from 'react'
import '../routepage.css'
import {Header} from '../components/Header'
import {Footer} from '../components/Footer'
import styled from 'styled-components';
import { BrowserRouter , Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Tron from '../components/Tron';
import Solona from '../components/Solona';
import i1 from '../assets/solana.png'
import i2 from '../assets/tron.png'
// import SendImage from '../assets/send.jpeg';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

export default function Route1Page({ children ,accessToken,toggleTheme,removeToken}:any) {

  const [crypto, setCrypto]=useState("Tron")
  const navigate= useNavigate();
  useEffect(()=>{
    // alert('Home rerendering')
   
    if(!localStorage.getItem("access_token"))
        {
       removeToken()
        navigate('/')
        }
    
   
},)

  return (
<Wrapper style={{height:'100vh', overflow:'hidden'}} >
    <Header handleToggleClick={toggleTheme} />
    <div className="mainbox">
      
      <div className="container" style={{margin:'25px', height:'80vh',marginLeft:'auto',marginRight:'auto'}}>
        {
          crypto=="Tron"?<img src={i2} style={{height:'240px',position:'absolute',top:'42%',left:'53%'}} />:
          <img src={i1} style={{position:'absolute',top:'43%',left:'53%'}} />
        }
        
       
        <div className="heading" style={{marginTop:'20px'}}>
         <select className="options" onChange={(e)=>{
          setCrypto(e.target.value)
        }}>
          <option value="Tron">TRON</option>
          <option value="Solona">SOLONA</option>
        </select>
        </div>
<>
{
      crypto==="Tron" ?
       (<Tron/>): (<Solona/>)
}
</>
      </div>


    </div>
    </Wrapper>
  )
}
