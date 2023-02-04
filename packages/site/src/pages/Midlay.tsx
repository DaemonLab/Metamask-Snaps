import { FunctionComponent, ReactNode, useContext, useEffect} from 'react';
import styled from 'styled-components';
import '../App.css';
import React,{useState} from 'react';
import Chat from '../components/Chat'
import { Routes, Route,  useNavigate,useParams } from "react-router-dom";

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



const Midlay=({ rooms,access,contacts}:any)=> {
    const navigate= useNavigate();
    const[transacts,setTransactions]= useState([]);
    const {roomId}=useParams()
    const getTrans=async()=>{
        try{
        const res=await axios.get(
          `https://knotty-calendar-production.up.railway.app/group/${roomId}`,
          {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access}` 
              }
        })
          const data=res.data;
          console.log(data)
          console.log('Data',data.splits)
          console.log('Transacts', transacts)
          let reset=false;
          if(data.splits.length!==transacts.length)
          {
            reset=true;
          }
          
          if(reset)
          {
            console.log('Data unequal')
            await setTransactions(data.splits)
            console.log('Transacts', transacts)
          }
            
          }
        catch(err)
        {
          console.log(err);
        }
    }  
    useEffect(()=>{
      getTrans();
      
    })


    useEffect(()=>{
        alert('Midlay rerendering')
       
       
        
       
    },)
  
  
  return (
    
    
    
    <div className="chat__body"
    style={{marginTop:0,flex:.7}}
        >
    <Midbar rooms={rooms} access={access} contacts={contacts} transacts={transacts}/>
    <Routes>
          <Route  path="transacts/:transactid" element={<Chat rooms={rooms} transacts={transacts} access={access} contacts={contacts}/>}>
          </Route>
    </Routes>
    </div>
    

 
  )
}
export default Midlay;
