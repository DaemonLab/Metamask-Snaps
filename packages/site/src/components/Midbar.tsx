    // sidebar for chat icons and working
import React,{useState,useEffect} from 'react'
import "./sidebar.css"
import axios from 'axios'
import InputLabel from '@mui/material/InputLabel';
import { Avatar, IconButton, Tooltip, Button,ButtonGroup} from '@mui/material';
import { AddCircleOutline, ChatBubble, ContentCutOutlined, DonutLargeRounded, ExitToAppOutlined, SearchRounded} from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Midbarcont from './Midbarcont';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {useNavigate} from'react-router-dom';
import { useParams } from 'react-router-dom';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import { experimentalStyled as styled } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const inputStyle={
  padding:'10px',
  margin:'2px',
  fontSize:'14px',
  fontFamily:'sans-serif'
}
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #131c21',
  boxShadow: 24,
  borderRadius:'5%',
  p: 4,
  backgroundColor:"#0b1012",
};
const memberStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '1px solid #131c21',
  borderRadius:'5%',
  boxShadow: 24,
  p: 4,
  backgroundColor:"#0b1012"
};

const Midbar=({rooms,access,contacts,transacts}:any)=> {

  
  const [open, setOpen] = React.useState(false);
  const [memberOpen,setMemberOpen]=useState(false);
  const [payer,setPayer]=useState();
  const handleMemberOpen=()=>setMemberOpen(true);
  const handleMemberClose=()=>setMemberOpen(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [formData,setFormData]=useState({name:"",amount:""})
    const [memberData,setMemberData]=useState({address:""})
    const {roomId}=useParams()
    // const[transacts,setTransactions]= useState([]);
  
   

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
        if (transacts && transacts.length > 0) {
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
 
  //   const getTrans=async()=>{
  //     try{
  //     const res=await axios.get(
  //       `https://knotty-calendar-production.up.railway.app/group/${roomId}`,
  //       {
  //         headers: { 
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${access}` 
  //           }
  //     })
  //       const data=res.data;
  //       console.log(data)
  //       console.log('Data',data.splits)
  //       console.log('Transacts', transacts)
  //       let reset=false;
  //       if(data.splits.length!==transacts.length)
  //       {
  //         reset=true;
  //       }
  //       else {
  //         for(let i:any = 0; i < transacts.length; i++)
  //         {
  //          if( data.splits[i].name!=transacts[i].name)
  //          {
  //           reset=true;
  //           break;
  //          }
  //         }
  //       }
  //       if(reset)
  //       {
  //         console.log('Data unequal')
  //         setTransactions(data.splits)
  //       }
          
  //       }
  //     catch(err)
  //     {
  //       console.log(err);
  //     }
  // }  
  // useEffect(()=>{
  //   getTrans();
    
  // })
  
  const navigate=useNavigate();
  const split=async()=>{
    const data={
      name:formData.name,
      date:new Date(),
      involved:membersArray.map((member:any)=>{return{
        user:member,
        amount: payer!=member?parseFloat(formData.amount)-parseFloat(formData.amount)/membersArray.length:-1*parseFloat(formData.amount)/membersArray.length
      }})
    }
   
    console.log(data)
    try{
      
  const res=await axios.post(`https://knotty-calendar-production.up.railway.app/split/${roomId}`,data,{
                headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}` }
              })
        console.log(res)
        handleClose();
        navigate('/home')
            }catch(err)
            {
              console.log(err)
            }
  }
  
  const addMember=async()=>{
    const data={
      groupId:roomId,
      address:memberData.address
    };
    console.log("Existing USer",data)
    try{
  const res=await axios.post('https://knotty-calendar-production.up.railway.app/group/add', data,{
                headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}` }
              })
        console.log(res)
        handleMemberClose();
        navigate('/home')
            }catch(err)
            {
              console.log(err)
              if(err.response && err.response.data.error)
              {

                  alert(err.response.data.error)
                
              }
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
    
      
      const temp=rooms.length>0 ?rooms.find((room:any)=>roomId==room.id):null;
      console.log(temp)
      const membersArray=temp!=null ? Object.keys(temp.members):[];
    return (
        <div className="Sidebar" >
           <div className="Sidebar__header" style={{alignItems:'center'}}>               
                {temp && temp.name}
                <div  style={{display: 'flex',
                  justifyContent:'space-between',
                  minWidth:'6vw',
                  alignItems:'center'}}>
                <IconButton>
                 <Tooltip title="Add Split"> 
               <ReceiptIcon onClick={handleOpen} fontSize="large" style={{color:"#B1B3B5", }}/>
               </Tooltip>
               </IconButton>
               <IconButton>
                 <Tooltip title="Add User"> 
               <GroupAddIcon onClick={handleMemberOpen} fontSize="large" style={{color:"#B1B3B5", }}/>
               </Tooltip>
               </IconButton>
               </div>
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
            }>New Split</div>
             <div className="" >
             <div style={{
                display:'flex',
                flexDirection:'column',
                
               }}>
            <div className="" style={{display:'flex',justifyContent:'space-between',alignItems:"center",}}>
                Split Name : <input style={inputStyle} placeholder='Split Name' name="name" type='text' value={formData.name} onChange={onChange}/>
                </div>
                <div className="" style={{display:'flex',justifyContent:'space-between',alignItems:"center",}}>
                Total Amount : <input style={inputStyle} placeholder='in INR' name="amount" type='number' value={formData.amount} onChange={onChange}/>
                </div>

            </div> 
            <FormControl fullWidth > 

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                Paid By :
              </div>

              <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
            
            value={payer}
            label="Payer"
            style={{fontSize:'15px',backgroundColor:'white',width:'55%'}}
            onChange={(e:any)=>{
              setPayer(e.target.value);
            }}
          >
            {membersArray.map((member:any,index:number)=>(
              <MenuItem value={ member} key={index} style={{fontSize:'15px'}}> {contacts[member]==undefined? member:contacts[member]}</MenuItem>
            ))}
            {/* <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
          </div>
          </FormControl>
            {<div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:'2%'}}>
              <div>
                Includes :
                </div>
                <div>
                    <Grid container spacing={0.5} columns={1}>
                    {membersArray.map((member:any, index:number) => (
                      <Grid item xs={2} sm={4} md={4} key={index}>
                        <div style={{display:'flex',alignItems:'center'}}>
                        <Checkbox defaultChecked/>
                        <div style={{fontSize:'15px'}}>
                        {
                          
                        contacts[member]==undefined? member:contacts[member]
                        
                        }
                        </div>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                  </div>
                  </div>
              }
             </div>
            </div>
            <ButtonGroup disableElevation variant="contained" aria-label="small button group" style={{display:'flex',justifyContent:'center'}}>
              
           
            
            <Button   className = "submitBtn" onClick={async()=>{
            await split()}}> submit</Button>
        </ButtonGroup>
        </div>
                </Box>
              </Modal>
              {
                //for Adding Existing User to the Group
              }
               <Modal
                open={memberOpen}
                onClose={handleMemberClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={memberStyle}>
                <div className="" style={{
          display: "flex",
          flexDirection:"column",
          rowGap:4,
          justifyContent:'center'
          
        }}>
           <div style={{
          display: "flex",
          flexDirection:"column",
          
          padding:'5%',
          paddingBottom:'8%',
          rowGap:16,
          border:'1px solid white',
          borderRadius: 25,
          
          
          
        }}>
            <div style={
              {
                fontSize: 26,
                fontWeight: "bold",
                textAlign:"center",
                marginBottom:'2%',
                marginTop:'2%'
              }
            }>Add Existing User to Group</div>
            <div className="" style={{
              display:"flex",
              flexDirection:'row',
              alignItems:"center",
              justifyContent:'space-between',
              
              rowGap:4
              }}>
               
                <div>
                User Address : 
                </div>
                <input style={inputStyle} placeholder='User Address' name="address" type='text' value={memberData.address} onChange={(e)=>{setMemberData(()=>({
                  address:e.target.value}))}}/>
                  </div>
      
            
            </div>
            <ButtonGroup disableElevation  variant="contained" aria-label="small button group" style={{display:'flex',justifyContent:'center'}}>
              
              
            
            <Button   className = "submitBtn" onClick={async()=>{
            await addMember()}}> submit</Button>
        </ButtonGroup>
        </div>
                </Box>
              </Modal>
        </div>
        <Divider/>
              
               <Divider/>
               {/* checks the condition  whetjher the room nmae present or not */}
               {sidebarBool ? (
            <div className="Sidebar__chats" style={{marginBottom:0,paddingBottom:0}}>
              <Midbarcont addNewChat="true" />
              {(transacts && transacts!=undefined) &&transacts.map((transact:any) => (
                <Midbarcont key={transact.id} id={transact.id} name={transact.name} roomid={roomId} />
              ))}
            </div>
          ) : (
            <div className="Sidebar__chats" style={{overflowX:'hidden',marginBottom:0,paddingBottom:0}}>
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
