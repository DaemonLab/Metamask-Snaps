import React,{useState,useEffect} from 'react'
import "./sidebarchat.css"
import { Link, useNavigate } from "react-router-dom";
import { Avatar,Typography,Tooltip } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
const Midbarcont =(props: any)=> {
  // calling from anaother page and rendering props
  const { addNewChat, name, id, roomid,user,involved } = props;
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
//console.log("Involved",involved,"user",user,involved[user])
const navigate=useNavigate();
    return addNewChat!=="true"?(
      <div onClick={()=>{navigate(`/home/rooms/${roomid}/transacts/${id}`)}}  style={{textDecoration:"none",cursor:'pointer'}} >
        <div className="Sidebarchat">
        <Avatar style={{backgroundColor:'grey',marginRight:'5%',marginTop:5}}>
          <ReceiptLongIcon style={{color:'white', fontSize:30}}/>
          </Avatar>
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center' }}>
        
          
        </div>
        <div className="SidebarChat_info" style={{display:'flex',alignItems:'center',width:'120px',fontSize:'13px',fontWeight:'bold'}}>
            {name}
             {/* this will show the last sent or recieved message */}
             {/* <p >{messages[0]?.data.message}</p> */}
         </div>
        {involved[user]!=undefined && 
       
      (<div style={{ display:'flex',flexDirection:'column',alignItems:'right',width:'60%' }}>
        <Typography component="div" variant="h6" style={{fontFamily:"sans-serif",textAlign:'right',fontSize:'11px'}}>
        {involved[user]>0 ? 'You owe' : involved[user]==0 ?'You are settled up':'You are owed'}
        </Typography>
     
      <Typography component="div" variant="h6" style={{fontSize:'12px',marginLeft:'10px', display:involved[user]==0?'none':'',fontWeight:'bold',letterSpacing:0.7,color:involved[user]>0 ?'red': involved[user]==0?'gray': 'green',textAlign:'right'}}>
      
            ETH {Math.abs(involved[user])}
          </Typography>
         
          </div>)
           }
        
         
         
        </div>
        </div>
    ):(
        null
    )
}
export default Midbarcont
