// sidebar for chat icons and working
import React,{useState,useEffect} from 'react'
import axios from 'axios'
import "./sidebar.css"
import { Avatar, IconButton, Tooltip, Button,ButtonGroup,Switch, FormControlLabel } from '@mui/material';
import { AddCircleRounded, ChatBubble, ContentCutOutlined, DonutLargeRounded, ExitToAppOutlined, SearchRounded } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Sidebarchat from './SidebarChat';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { flexbox } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const Sidebar=({rooms,access}:any)=> {
    
    // useEffect(() => 
    //   onSnapshot(collection(db,"rooms"),(snapshot) => 
    //         setRooms(snapshot.docs.map((doc) => ({
    //             data:doc.data(),
    //             id: doc.id,
           
    //         }))))
      
    // ,[]
    // )
    const onChange=(e:any)=>{
      setFormData((prevState)=>({
        ...prevState,
        [e.target.name]: e.target.value
  
      }))
    }
    const onChangeUser=(e:any,index:number)=>{
      const {name,value}:any=e.target;
      const list:any=[...formData.users]
      list[index][name]=value;
      setFormData((prevState)=>({
        ...prevState,
          users:list
  
      }))
    }
    const navigate=useNavigate();
    const addGroup=async()=>{
      const data={
        name:formData.name,
        type:formData.type,
        users:formData.users.map(user=>{return user.address})
      }
      console.log(data)
      try{
       
    const res=await axios.post('https://knotty-calendar-production.up.railway.app/group', JSON.stringify(data),{
      headers: { 'Content-Type': 'application/json',
                  'Authorization': `Bearer ${access}` }
      });
                
          console.log(res)
          await setFormData({name:"",type: "personal",users:[{address:""}]})
          handleClose();
          navigate('/home')
              }catch(err)
              {
                console.log(err)
              }
           
    }
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
        return values.filter((v:any) => v.name.toLowerCase().match(re));
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
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [formData,setFormData]=useState({name:"",type: "personal",users:[{address:""}]})
    const addUsers=()=>{
      setFormData((pre:any)=>(
        {
          ...pre,
          users:[...pre.users,{id:"", address:""}]
        }

      ))
    }
    const removeUsers=(index:number)=>{
      const list=[...formData.users]
      list.splice(index,1)
      setFormData((pre:any)=>({
        ...pre,
        users:list
      }))
    }
    const [checked, setChecked] = React.useState(true);
    const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      backgroundColor:'black'
    };
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
               <AddCircleRounded onClick={handleOpen} fontSize="large" style={{color:"#B1B3B5", }}/>
               </Tooltip>
               </IconButton>
            
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                <div className="" style={{
          display: "flex",
          flexDirection:"column",
          rowGap:4,
          justifyContent:'center'
          
        }}>
           <div style={{
          display: "flex",
          flexDirection:"column",
          backgroundColor:'black',
          padding:6,
          paddingLeft:16,
          paddingRight:16,
          rowGap:16,
          border:'1px solid white',
          borderRadius: 25
          
          
          
        }}>
            <div style={
              {
                fontSize: 26,
                fontWeight: "bold",
                textAlign:"center",
                marginBottom:10,
                marginTop:10
              }
            }>Add Group</div>
            <div className="" style={{
              display:"flex",
              flexDirection:'row',
              alignItems:"center",
              columnGap:3,
              rowGap:4
              }}>
                Group Name : <input style={{height:24}} placeholder='Group Name' name="name" type='text' value={formData.name} onChange={onChange}/>
            </div>   
            {
              formData.users.map((user:any,index:number)=>{
                return(
                <div className="" key={index}
                style={{
                  display:"flex",
                  alignItems:"center",
                  columnGap:3
                  }}>
               User{index+1} Address: <input style={{height:24}}  placeholder='Address' name="address" type='text' value={user.address} onChange={e=>onChangeUser(e,index)}/> 
               {formData.users.length>1 &&
               (<button key={index} onClick={()=>removeUsers(index)}> Remove</button>)} 
                  </div>   
                )  
              })
            }
        
                  <FormControlLabel control={  
            <Switch checked={checked} onChange={()=>{
              setFormData((prev)=>({...prev,
              type:checked?'group':'personal'}))
              setChecked(!checked);
            }}/>} label='Personal'/>
            </div>
            <ButtonGroup  variant="contained" aria-label="small button group" style={{display:'flex',justifyContent:'center'}}>
              
               <Button   className = "submitBtn"  onClick={addUsers}> Add User</Button>
            
            <Button   className = "submitBtn" onClick={()=>{
              addGroup()}}> submit</Button>
        </ButtonGroup>
        </div>
                </Box>
              </Modal>
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
              {rooms.map((room:any) => (
                <Sidebarchat key={room.id} id={room.id} name={room.name} />
              ))}
            </div>
          ) : (
            <div className="Sidebar__chats">
              <Sidebarchat addNewChat="true" />
              {search.map((room:any) => (
                <Sidebarchat key={room.id} id={room.id} name={room.name} access={access} />
              ))}
            </div>
          )}

        </div>
    )
}

export default Sidebar;
