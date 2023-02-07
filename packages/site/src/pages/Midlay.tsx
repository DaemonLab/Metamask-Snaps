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
    const[transacts,setTransactions]:any= useState({ 
      simplified:null,
      drop:{
      },
      total:{
        
      },
      splits:[]});
       const handleExpandClick = (item:any ) => {
        console.log("Item ", item)
        setTransactions((prev):any=>({
          ...prev,
          drop:{
            ...prev.drop,
            [item]:!prev.drop[item]
          }
        }))
      };

    const {roomId}=useParams()
    const getTrans=async()=>{
        try{
        const res=await axios.get(
          `http://localhost:5000/group/${roomId}`,
          {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access}` 
              }
        })
        // const res2=await axios.get(
        //   `http://localhost:5000/group/${roomId}/graph`,
        //   {
        //     headers: { 
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${access}` 
        //       }
        // })
        // console.log("Graph",res2)
          const data=res.data;
          console.log("Raw Data",data)
          console.log("Graphs",data.graph)
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
              splits:data.splits,
              simplified:data.graph!=undefined?data.graph:prev.simplified,
              drop:data.graph ? Object.keys(data.graph).reduce((acc, cur):any => ({ ...acc, [cur]: prev.drop[cur]!=undefined ? prev.drop[cur] :false }), {}) : prev.drop,
              total:data.graph ? Object.keys(data.graph).reduce((acc, cur) => ({ ...acc, [cur]: 
                Object.values(data.graph[cur]).reduce((x, y):any => {
                  return x + y;
                }) 
                    
                }), {}): prev.total
            }
            ))
            console.log('Transacts', transacts)
          }
            
          }
        catch(err)
        {
          console.log(err);
          if (err.message === 'jwt expired') {
            localStorage.removeItem('access_token');
            navigate('/');
          }
        }
    }  
    useEffect(()=>{
      getTrans();
      
    })


    useEffect(()=>{
        // alert('Midlay rerendering')
       
       
        
       
    },)
  
  
  return (
    
    
    
    <div className="chat__body"
    style={{marginTop:0,flex:0.8}}
        >
          <Errorboundary>
    <Midbar rooms={rooms} access={access} contacts={contacts} transacts={transacts.splits} simplified={transacts.simplified} total={transacts.total} drop={transacts.drop} handleExpandClick={handleExpandClick} /></Errorboundary>
    <Routes>
          <Route  path="transacts/:transactid" element={<Chat rooms={rooms} transacts={transacts.splits} access={access} contacts={contacts}/>}>
          </Route>
    </Routes>
    </div>
    

 
  )
}
export default Midlay;
