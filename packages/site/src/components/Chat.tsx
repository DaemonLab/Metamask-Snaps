import React,{useState,useEffect} from 'react'
import "./Chat.css";
import "./sidebar.css"
import { Avatar,IconButton  } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useParams } from "react-router-dom";
import UserProfile from './UserProfile';
import Members from './Members';

function Chat({rooms,access,contacts,transacts}:any) {  
  const { transactid} = useParams();  
    
const transact=transacts.length!=0 ? transacts.filter((item:any)=> item.id===transactid):[];
const obj = transact.length>0 ? {
  name: transact[0].name,
  date: transact[0].date,
}:null;


    return (
      <>
      
        <div className="Chat" style={{minHeight:'100vh'}}>
            <UserProfile userData={obj}/>
            <Divider/>
      {console.log("Trnascats",transact)}

            <div className="Sidebar__chats" style={{
              paddingLeft:'9%',
              paddingRight:'9%'
              }}>
              <div style={{marginTop:'40px'}}>
            {transact.length>0&& contacts && transact[0].involved && Object.keys(transact[0].involved).map((mem:any,index:number)=>{
              return(
                <div key={index} >
                 
                 <Members name={contacts[mem]? contacts[mem]:'Unknown'} address={mem} amount={transact[0].involved[mem]}/>
                 <Divider/>
                  </div>
              )
            })}
            </div>
            </div>
        </div>
        </>
    )
}

export default Chat
