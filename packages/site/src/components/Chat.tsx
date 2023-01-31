import React,{useState,useEffect} from 'react'
import "./Chat.css";
import { Avatar,IconButton  } from '@mui/material';
import Divider from '@mui/material/Divider';
import Midbar from './Midbar';
import { AttachFile, InsertEmoticonOutlined, MicOutlined, MoreVert, Search, SearchRounded } from '@mui/icons-material';
import { useParams } from "react-router-dom";

// import { Picker } from "emoji-mart";
function Chat() {  
  let {roomId, transactid} = useParams();  

    const[seed,setSeed]=useState("");
    const[input,setInput]=useState("");
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([{
        data:{
            name:`${roomId}`,
            message:`Heefwfreglo ${transactid} `,
            timestamp:new Date,        
        }
    }]);
//     useEffect(() => {
//     setSeed(Math.floor(Math.random()*5000))
//     }, [])
//     //roomview to get data from
//     const d=doc(db,"rooms",roomId)
//   getDoc(d)
//   .then((doc)=>{
//      setRoomName(doc.data().name)
//   })
//   timestamp
// const messagesColRef = collection(db, "rooms", roomId, "messages");
// const messagesQuery = query(messagesColRef, orderBy("timestamp"));
// console.log(messages)

// useEffect(() => 

// onSnapshot(messagesQuery, (snapshot) => {
//     setMessages(snapshot.docs.map(doc => ({
//     data:doc.data(),
// })))
//  }),
//     [roomId]
// )
const displayName = localStorage.getItem("displayName");
const [issendChecked, setIssendChecked] = useState(false);
function SendMessage(e:any){
    e.preventDefault();
    if (input.length > 0) {
        // const ds=collection(db,"rooms", roomId,"messages");
        // addDoc(ds, {
        //     message: input,
        //     name: displayName,
        //     timestamp: serverTimestamp(),
        //     photoURL: localStorage.getItem("photoURL"),
            
        //   });
        console.log('message sent')
        setIssendChecked(!issendChecked);
        setInput("");
      }

}
// emoji 
const [emoji, setEmoji] = useState(false);
function addEmoji(e:any){ 
    let emoji = e.native;
    setInput(input + emoji);
}
  const checkEmojiClose = () => {
    if (emoji) {
      setEmoji(false);
    }
  };
  // search
   const [search, setSearch] = useState([]);
       console.log(search)
    const [inputs,setInputs] = useState("");
    const [sidebarBool, setsidebarBool] = useState(true);
    // filters the search according to the alphabert whether CAPS OR SMALL
    const matcher = (s:any, values:any) => {
        const re = RegExp(`.*${s.toLowerCase().split("").join(".*")}.*`);
        return values.filter((v:any) => v.data.name.toLowerCase().match(re));
      };
    //   sets the search if the room nmae lenght is >0
      useEffect(() => {
        if (messages.length > 0) {
          setSearch(matcher(inputs,messages));
        }
        if (inputs === "") {
          setsidebarBool(true);
        }
      }, [inputs]);
    //   value of input changes
      const handleChange = (e:any) => {
        setsidebarBool(false);
        setInputs(e.target.value);
      };
//   lastsween photo will upload in the profile pic
// console.log(messages[messages.length - 1]?.data.photoURL)
const [lastseenPhoto, setLastseen] = useState("");
//   useEffect(() => {
//     setLastseen(messages[messages.length - 1]?.data.photoURL);
//   }, [messages]);
//   console.log(lastseenPhoto)
    return (
      <>
      <Midbar />
        <div className="Chat">
            <div className="Chat__header">
            <Avatar src={lastseenPhoto}/>
           
            <div className="Chat__headerinfo">
             <h3>{roomName}</h3>
        
            </div>
            <div className="Chat__headerright">
        
                 <input style={{        fontFamily: "Open sans",

    borderRadius: "20px",    
    /* padding: 10px; */
    backgroundColor:"#323739",
    color: "lightgray",
     outline: "none",

    }} placeholder="Search Based on Name" type="text" value={inputs} onChange={handleChange}/>
                   <IconButton><SearchRounded style={{color:"#B1B3B5"}} />
                             
               </IconButton>
               
               <IconButton> <MoreVert style={{color:"#B1B3B5"}}/> </IconButton>
            </div>
            </div>
            <Divider/>
            {sidebarBool ? (
            <div className="Chat__body" onClick={checkEmojiClose}>
       {/* checks the condtion to apply css 
       for eg : if a message is sent by sendwer the message color will be differnet and reciever color will be differfnt  */}
            {messages.map((message:any)=>(
                <p className={`Chat__Messages  ${message.data.name === displayName && "Chat__Reciver"}`}>
                <span className='Chat__Name'>{message.data.name} </span>
                <br></br>
              {message.data.message} jfpoerw {transactid}
                <span className='Chat__Time'>{message.data.timestamp.toUTCString().slice(5,12)}</span>
                </p>
             ))}
         
            </div>
                ):( 
                <div className="Chat__body" onClick={checkEmojiClose}>
              {search.map((message)=>(
                <p className={`Chat__Messages  ${message.data.name === displayName && "Chat__Reciver"}`}>
                <span className='Chat__Name'>{message.data.name}</span>
                <br></br>
              {message.data.message}
                <span className='Chat__Time'>{message.data.timestamp.toUTCString().slice(5,12)}</span>
                </p>
             ))}
         
            </div>
            )}

            <div className="Chat__footer">
            <IconButton>
              {/* <InsertEmoticonIcon /> */}
              <InsertEmoticonOutlined 
              
                style={{color:"#B1B3B5"}}
                onClick={() => setEmoji(!emoji)}
              />
              {/* {emoji ? <Picker className="emoji-mart-dark" onSelect={addEmoji} /> : null} */}
            </IconButton>
                <IconButton> <AttachFile style={{color:"#B1B3B5"}}/> </IconButton>
                <form>
                    <input type="text" value={input}  onClick={checkEmojiClose}onChange={(e)=>setInput(e.target.value)}
                    placeholder='Send a message'/>
                    <button type="submit" onClick={SendMessage}>Send Messages</button>
                </form>
                <IconButton><MicOutlined style={{color:"#B1B3B5",padding:"10px",}}/></IconButton>
            </div>
        </div>
        </>
    )
}

export default Chat
