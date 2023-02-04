import React,{useState,useEffect} from 'react'
import "./Chat.css";
import { Avatar,IconButton  } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useParams } from "react-router-dom";
import UserProfile from './UserProfile';

function Chat({rooms,access,contacts,transacts}:any) {  
  let {roomId, transactid} = useParams();  
    let split;
    const room=rooms.find((room:any)=>room.id==roomId);
    console.log(room)

const obj = {
  name: "Trasn 1",

  location: {
    street: {
      number: 6173,
      name: "Rue de L'Abbé-Patureau"
    },
    coordinates: {
      latitude: "43.794315",
      longitude: "-79.350761"
    },
    timezone: {
      offset: "+5:45",
      description: "Kathmandu"
    },
    city: "Saint-Pierre",
    state: "Meurthe-et-Moselle",
    country: "France",
    postcode: 92660
  },
  _id: "5e3346f1c666436078697a3e",
  gender: "female",
  email: "rachel.barbier@example.com",
  dob: {
    date: "1964-09-16T17:09:55.234Z",
    age: 56
  },
  registered: {
    date: "2018-05-27T10:44:36.234Z",
    age: 2
  },
  phone: "05-90-58-33-75",
  cell: "06-70-72-22-65",
  id: {
    name: "INSEE",
    value: "2NNaN41244518 56"
  },
  picture: {
    large: "https://randomuser.me/api/portraits/women/61.jpg",
    medium: "https://randomuser.me/api/portraits/med/women/61.jpg",
    thumbnail: "https://randomuser.me/api/portraits/thumb/women/61.jpg"
  },
  nat: "FR",
  devInfo: {
    type: "Backend Developer",
    intro: "Lorem ipsum dolor sit amet, adipiscing elit",
    bio:
      "Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring."
  }
};
const transact=transacts.find((item:any)=> item.id=transactid)

    return (
      <>
      
        <div className="Chat" style={{minHeight:'100vh'}}>
            <UserProfile userData={obj}/>
            <Divider/>

            <div className="Chat__body" style={{color:'white'}}>
              Split Name: {transact.name} 
              Date: {transact.date}
              {console.log(contacts)}
            {transact.involved && Object.keys(transact.involved).map((mem:any,index:number)=>{
              return(
                <div key={index} >
                 User: {contacts[mem]? contacts[mem]:mem} Amount:{transact.involved && transact.involved[mem]}
                  </div>
              )
            })}
            </div>
        </div>
        </>
    )
}

export default Chat
