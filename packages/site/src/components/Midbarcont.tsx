import React,{useState,useEffect} from 'react'
import "./sidebarchat.css"
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
const Midbarcont =(props: any)=> {
  // calling from anaother page and rendering props
  const { addNewChat, name, id, roomid } = props;
  const [messages, setMessages] = useState('');  
  //generating random avatar
    const[seed,setSeed]=useState<any| null>("");
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
const navigate=useNavigate();
    return addNewChat!=="true"?(
      <div onClick={()=>{navigate(`/home/rooms/${roomid}/transacts/${id}`)}}  style={{textDecoration:"none",cursor:'pointer'}} >
        <div className="Sidebarchat">
         <Avatar style={{backgroundColor:'grey',marginRight:'5%',marginTop:5}}>
          <ReceiptLongIcon style={{color:'white', fontSize:30}}/>
          </Avatar>
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
export default Midbarcont
