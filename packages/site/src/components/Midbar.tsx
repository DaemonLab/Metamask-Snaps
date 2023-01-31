    // sidebar for chat icons and working
import React,{useState,useEffect} from 'react'
import "./sidebar.css"
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline, ChatBubble, ContentCutOutlined, DonutLargeRounded, ExitToAppOutlined, SearchRounded } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Midbarcont from './Midbarcont';
import { useParams } from 'react-router-dom';

const Midbar=()=> {
    const {roomId}=useParams()
    const[transacts,setRooms]= useState([{
        id:1,
        data:{
            name:'Transaction 1',
            message:{
                
            }
        }
    },
    {
        id:2,
        data:{
            name:'Transaction 2 ',
            message:{
                
            }
        }
    }]);
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
        if (transacts.length > 0) {
          setSearch(matcher(input, transacts));
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
                {roomId}
        </div>
        <Divider/>
              
               <Divider/>
               {/* checks the condition  whetjher the room nmae present or not */}
               {sidebarBool ? (
            <div className="Sidebar__chats">
              <Midbarcont addNewChat="true" />
              {transacts.map((transact) => (
                <Midbarcont key={transact.id} id={transact.id} name={transact.data.name} roomid={roomId} />
              ))}
            </div>
          ) : (
            <div className="Sidebar__chats">
              <Midbarcont addNewChat="true" />
              {search.map((room) => (
                <Midbarcont key={room.id} id={room.id} name={room.data.name} />
              ))}
            </div>
          )}

        </div>
    )
}

export default Midbar;
