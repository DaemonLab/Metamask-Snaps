import React,{useState,useEffect} from 'react'
import "./Chat.css";
import "./sidebar.css"
import { Avatar,IconButton  } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useParams } from "react-router-dom";
import UserProfile from './UserProfile';
import Members from './Members';
import axios from 'axios';
import Errorboundary from './errorboundary';

function Chat({rooms,access,contacts,transacts}:any) {  
  const { transactid,roomId} = useParams();  
  console.log("GroupID",roomId,"SplitID",transactid)
    const [user,setUser]=useState();
const transact=transacts.length!=0 ? transacts.filter((item:any)=> item.id===transactid):[];
const obj = transact.length>0 ? {
  id: transact[0].id,
  name: transact[0].name,
  date: transact[0].date,
  groupId:roomId
}:null;

const getUser=async()=>{
  try{
  const resUser=await axios.get('https://knotty-calendar-production.up.railway.app/user',{
    headers: { 'Content-Type': 'application/json',
    'Authorization': `Bearer ${access}` }
    
  })
  console.log("chat",resUser.data)
  if(user!=resUser.data.address)
  setUser(resUser.data.address)
}
catch(e)
{
  console.log('Chat e',e)
}

}
useEffect(()=>{
  getUser()
},)

    return (
      
      
        <div className="Chat" style={{minHeight:'100vh'}}>
            <Errorboundary>
            <UserProfile userData={obj} access={access}/>
            </Errorboundary>
            <Errorboundary>
            <Divider/>
            </Errorboundary>
      {console.log("Trnascats",transact)}

            <div className="Sidebar__chats" style={{
              paddingLeft:'9%',
              paddingRight:'9%'
              }}>
              <div style={{marginTop:'40px'}}>
            {transact.length>0&& contacts && transact[0].involved && Object.keys(transact[0].involved).map((mem:any,index:number)=>{
              return(
                <div key={index} >
                 <Errorboundary>
                 <Members name={user==mem ? 'You' :contacts[mem]? contacts[mem]:'Unknown'} address={mem} amount={transact[0].involved[mem]}/>
                 </Errorboundary>
                 <Errorboundary>
                  <Divider/>
                  </Errorboundary>
                  </div>
              )
            })}
            </div>
            </div>
        </div>
        
    )
}

export default Chat
