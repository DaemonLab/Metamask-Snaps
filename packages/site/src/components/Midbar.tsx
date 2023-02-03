    // sidebar for chat icons and working
import React,{useState,useEffect} from 'react'
import "./sidebar.css"
import axios from 'axios'
import { Avatar, IconButton, Tooltip, Button,ButtonGroup  } from '@mui/material';
import { AddCircleOutline, ChatBubble, ContentCutOutlined, DonutLargeRounded, ExitToAppOutlined, SearchRounded} from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Midbarcont from './Midbarcont';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useParams } from 'react-router-dom';

const Midbar=({rooms,access}:any)=> {
  const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [formData,setFormData]=useState({name:"",date:new Date,users:[{id:"",addresss:""}],type:"personal"})
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
    const {roomId}=useParams()
    const[transacts,setTransactions]= useState([]);
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
    setSeed(Math.floor(Math.random()*1));
  
    }, )

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
    const getTrans=async()=>{
      try{
      const res=await axios.get(
        'https://knotty-calendar-production.up.railway.app/group/eocVicbi3FLtK7OLW6Ln',
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}` 
            }
      })
        const data=res.data;
        console.log(data)
        console.log('Data',data.splits)
        console.log('Transacts', transacts)
        let reset=false;
        if(data.splits.length!==transacts.length)
        {
          reset=true;
        }
        else {
          for(let i:any = 0; i < transacts.length; i++)
          {
           if( data.splits[i].name!=transacts[i].name)
           {
            reset=true;
            break;
           }
          }
        }
        if(reset)
        {
          console.log('Data unequal')
          setTransactions(data.splits)
        }
          
        }
      catch(err)
      {
        console.log(err);
      }
  }  
  useEffect(()=>{
    getTrans();
  })
  const addGroup=async()=>{
    try{
  const res=await axios.post('http://localhost:4000/group', formData,{
                headers: { 'Content-Type': 'application/json',
                            'access_token': access }
              })
        console.log(res)
            }catch(err)
            {
              console.log(err)
            }
  }
    //   photo
    const photoURL =
    localStorage.getItem("photoURL") !== ""
      ? localStorage.getItem("photoURL")
      : null;
      console.log(photoURL)
      const displayName = localStorage.getItem("displayName");
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
  
    return (
        <div className="Sidebar" >
           <div className="Sidebar__header">               
                {rooms.find((room:any)=>roomId==room.id).name}
                <Button onClick={handleOpen} variant='contained'>
                  Add
                  </Button>
               
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
            }>Add Transaction</div>
            <div className="" style={{
              display:"flex",
              flexDirection:'row',
              alignItems:"center",
              columnGap:3,
              rowGap:4
              }}>
                Transaction Name : <input style={{height:24}} placeholder='Group Name' name="name" type='text' value={formData.name} onChange={onChange}/>
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
        
                    
            
            </div>
            <ButtonGroup  variant="contained" aria-label="small button group" style={{display:'flex',justifyContent:'center'}}>
              
               <Button   className = "submitBtn"  onClick={addUsers}> Add User</Button>
            
            <Button   className = "submitBtn" onClick={async()=>{console.log(formData)
            await addGroup()}}> submit</Button>
        </ButtonGroup>
        </div>
                </Box>
              </Modal>
        </div>
        <Divider/>
              
               <Divider/>
               {/* checks the condition  whetjher the room nmae present or not */}
               {sidebarBool ? (
            <div className="Sidebar__chats">
              <Midbarcont addNewChat="true" />
              {transacts.map((transact) => (
                <Midbarcont key={transact.id} id={transact.id} name={transact.name} roomid={roomId} />
              ))}
            </div>
          ) : (
            <div className="Sidebar__chats">
              <Midbarcont addNewChat="true" />
              {search.map((room:any) => (
                <Midbarcont key={room.id} id={room.id} name={room.name} />
              ))}
            </div>
          )}

        </div>
    )
}

export default Midbar;
