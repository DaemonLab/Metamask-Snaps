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
import Errorboundary from '../components/errorboundary';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;



const Midlay=({ rooms,access,contacts}:any)=> {
    const navigate= useNavigate();
    const[transacts,setTransactions]= useState({ 
      simplified:{
      '0x1': { '0x2':40, '0x3': 50,'0x4': -25,'0x5': -25,'0x6': -25,'0x7': 0 },
      '0x2' : { '0x4': 25 },
      },
      splits:[]});
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
        // const res2=await axios.get(
        //   `https://knotty-calendar-production.up.railway.app/group/${roomId}/graph`,
        //   {
        //     headers: { 
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${access}` 
        //       }
        // })
        // console.log("Graph",res2)
          const data=res.data;
          console.log(data)
          console.log('Data',data.splits)
          console.log('Transacts', transacts)
          let reset=false;
          if(data.splits.length!==transacts.splits.length)
          {
            reset=true;
          }
          
          if(reset)
          {
            console.log('Data unequal')
            await setTransactions((prev):any=>({
              ...prev,
              splits:data.splits
            }
            ))
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
    style={{marginTop:0,flex:0.7}}
        >
          <Errorboundary>
    <Midbar rooms={rooms} access={access} contacts={contacts} transacts={transacts.splits} simplified={transacts.simplified} /></Errorboundary>
    <Routes>
          <Route  path="transacts/:transactid" element={<Chat rooms={rooms} transacts={transacts.splits} access={access} contacts={contacts}/>}>
          </Route>
    </Routes>
    </div>
    

 
  )
}
export default Midlay;
