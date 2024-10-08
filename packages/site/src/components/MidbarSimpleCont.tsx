import React,{useState,useEffect} from 'react'
import "./sidebarchat.css"
import { Avatar, IconButton, Tooltip, Button,ButtonGroup} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
const MidbarSimpleCont =(props: any)=> {
  // calling from anaother page and rendering props
  const { addNewChat, amount, first,handleExpandClick,user,open,contacts} = props;
  const [messages, setMessages] = useState('');  
  //generating random avatar
    const[seed,setSeed]=useState<any|null>("");
    useEffect(() => {
    setSeed(Math.floor(Math.random()*5000))
    }, [])
   // console.log(contacts)
    return addNewChat!=="true"?(
      <div  style={{textDecoration:"none",cursor:'default'}}>
        <div className="MidbarSimple">
         
         <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
        
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center' }}>
        <Avatar style={{padding:"0 0px 0 0px"}}src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`}/>
          <Typography component="div" variant="h5" style={{fontWeight:'bold',fontSize:'12px',letterSpacing:0.7}}>
            {user==first?'You' : (contacts!=undefined && contacts[first]!=undefined)? contacts[first]: 'Unknown'}
          </Typography>
          <Typography variant="subtitle1" color="grey" component="div" >
          <Tooltip title={<div style={{fontSize:'10px'}}>{first}</div>} placement="right">
            <div style={{cursor:'alias',overflow:'hidden',textOverflow: "ellipsis",textAlign:'left',maxWidth:'60px'}}>
            {first}
            </div>
            </Tooltip>
          </Typography>
          
        </div>
    
      
      <div style={{ display:'flex',flexDirection:'column',alignItems:'right',width:'100%' }}>
     
            <Typography component="div" variant="h6" style={{fontFamily:"sans-serif",textAlign:'right'}}>
        {amount>0? `Owes `: amount==0 ?`is settled`: `is owed `
        }
        </Typography>
      <Typography component="div" variant="h6" style={{marginLeft:'10px', display:amount==0?'none':'flex',alignItems:'center',justifyContent:'flex-end',fontWeight:'bold',letterSpacing:0.7,color:amount>0 ?'red': amount==0?'gray': 'green',textAlign:'right'}}>
      
            ETH {Math.abs(amount)}
            <div style={{display:'inline',textAlign:'right',height:'15px'}} onClick={()=>handleExpandClick(first)}> 
      <button style={{backgroundColor:'transparent',color:'white',border:'none',padding:'3px',marginTop:'-10px'}}>       
      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
         </button>   
            </div>
          </Typography>
          
          </div>
          
         </div>
        </div>
        </div>
    ):(
        null
    )
}
export default MidbarSimpleCont
