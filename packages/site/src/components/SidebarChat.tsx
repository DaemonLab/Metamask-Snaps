import React,{useState,useEffect} from 'react'
import "./sidebarchat.css"
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import axios from'axios';


const Sidebarchat =(props: any)=> {
  
  
  // calling from anaother page and rendering props
  const navigate = useNavigate();
  const { addNewChat, name, id,access} = props;
  const [messages, setMessages] = useState('');
  //generating random avatar
    const[seed,setSeed]=useState("");
    useEffect(() => {
    setSeed(Math.floor(Math.random()*5000))
    }, [])
    // add room
    const createChat = () => {
      const roomName = prompt("Please enter name for chat");
      if (roomName && roomName.length >= 20) {
        return alert("enter a shorter name for the room");
      }
      if (roomName) {
         console.log('chat created')
      }
    };
// get by id about last message wfrom firebase
//   useEffect(() => {
    
//     if(id){
//       const messagesColRef = collection(db, "rooms", id, "messages");
//       const messagesQuery = query(messagesColRef, orderBy("timestamp","desc"));
//       onSnapshot(messagesQuery,(snapshot) => 
//       setMessages(snapshot.docs.map((doc) => ({
//        data:doc.data(),
  
//    }))))
//     }
  
//   }, [id])
const getTrans=async()=>{
  try{
  const res=await axios.get(
    'http://localhost:5000/group/eocVicbi3FLtK7OLW6Ln',
    {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access}` 
        }
  })
    const data=res.data;
    console.log(data)
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
    return addNewChat!=="true"?(
      <div onClick={async()=>{
        await getTrans();
        navigate(`/home/rooms/${id}`);
      }} style={{textDecoration:"none", cursor:'pointer'}}>
        <div className="Sidebarchat">
         <Avatar style={{padding:"0 15px 0 13px"}}src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`}/>
         <div className="SidebarChat_info">
             <h2 >{name}</h2>
             {/* this will show the last sent or recieved message */}
             {/* <p >{messages[0]?.data.message}</p> */}
         </div>
        </div>
        </div>
    ):(
        null
    )
}
export default Sidebarchat
