// sidebar for chat icons and working
import React,{useState,useEffect} from 'react'
import "./sidebar.css"
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline, ChatBubble, ContentCutOutlined, DonutLargeRounded, ExitToAppOutlined, SearchRounded } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Sidebarchat from './SidebarChat';
import Midbar from './Midbar';


const Sidebar=()=> {
    const[rooms,setRooms]= useState([{
        id:1,
        data:{
            name:'A',
            message:{
                
            }
        }},
        {
        id:2,
        data:{
            name:'Room 2',
            message:{
                
            }
        }
      }
    ]);
    // useEffect(() => 
    //   onSnapshot(collection(db,"rooms"),(snapshot) => 
    //         setRooms(snapshot.docs.map((doc) => ({
    //             data:doc.data(),
    //             id: doc.id,
           
    //         }))))
      
    // ,[]
    // )


function logout () {
   console.log('logout')
}
    const[seed,setSeed]=useState("");
    useEffect(() => {
    setSeed(Math.floor(Math.random()*1))
    }, [])

    // serach filter
    const [search, setSearch] = useState([]);
    console.log(search)
    const [input,setInput] = useState("");
    const [sidebarBool, setsidebarBool] = useState(true);
    // filters the search according to the alphabert whether CAPS OR SMALL
    const matcher = (s:any, values:any) => {
        const re = RegExp(`.*${s.toLowerCase().split("").join(".*")}.*`);
        return values.filter((v:any) => v.data.name.toLowerCase().match(re));
      };
    //   sets the search if the room nmae lenght is >0
      useEffect(() => {
        if (rooms.length > 0) {
          setSearch(matcher(input, rooms));
        }
        if (input === "") {
          setsidebarBool(true);
        }
      }, [input]);
    //   value of input changes
      const handleChange = (e:any) => {
        setsidebarBool(false);
        setInput(e.target.value);
      };
// add room
 const createChat = () => {
    //   const roomName = prompt("Please enter name for chat");
    //   if (roomName && roomName.length >= 20) {
    //     return alert("enter a shorter name for the room");
    //   }
    //   if (roomName) {
    //      addDoc(collection(db, "rooms"), {
    //       name: roomName,
    
    //     });
    //   }
    console.log('chat created')
    };
    //   photo
    const photoURL =
    localStorage.getItem("photoURL") !== ""
      ? localStorage.getItem("photoURL")
      : null;
      console.log(photoURL)
      const displayName = localStorage.getItem("displayName");
    return (
        <div className="Sidebar" >
           <div className="Sidebar__header">    
           <Avatar style={{marginLeft:"15px"}} src={photoURL}/>
           <b className="TEXT">{displayName}</b>
           <div className="Sidebar__headerRight">
               <IconButton>
                 <Tooltip title="Add Room"> 
               <AddCircleOutline  onClick={createChat} style={{color:"#B1B3B5"}}/>
               </Tooltip>
               </IconButton>
               <IconButton> <ChatBubble style={{color:"#B1B3B5"}}/> </IconButton>
               <IconButton onClick={logout}>  <Tooltip title="Logout"> 
                 <ExitToAppOutlined   style={{color:"#B1B3B5"}}/></Tooltip> </IconButton>
           </div>
        </div>
        <Divider/>
               <div className="Sidebar__search">
                   <div className="Sidebar__searchContainer">  
                    <SearchRounded />
                   <input placeholder="Search or Start New Chat" type="text" value={input} onChange={handleChange}/></div>
                
               </div>
               <Divider/>
               {/* checks the condition  whetjher the room nmae present or not */}
               {sidebarBool ? (
            <div className="Sidebar__chats">
              <Sidebarchat addNewChat="true" />
              {rooms.map((room) => (
                <Sidebarchat key={room.id} id={room.id} name={room.data.name} />
              ))}
            </div>
          ) : (
            <div className="Sidebar__chats">
              <Sidebarchat addNewChat="true" />
              {search.map((room) => (
                <Sidebarchat key={room.id} id={room.id} name={room.data.name} />
              ))}
            </div>
          )}

        </div>
    )
}

export default Sidebar;
