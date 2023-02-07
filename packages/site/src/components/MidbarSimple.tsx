import React,{useState,useEffect} from 'react'
import "./sidebarchat.css"
import { Avatar, IconButton, Tooltip, Button,ButtonGroup} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MidbarSimple =(props: any)=> {
  // calling from anaother page and rendering props
  const { addNewChat, amount, first, second,user,contacts} = props;
  const [messages, setMessages] = useState('');  
  //generating random avatar
    const[seed,setSeed]=useState<any|null>("");
    useEffect(() => {
    setSeed(Math.floor(Math.random()*5000))
    }, [])
    const other=second==user?'you': (contacts && contacts[second]!=undefined)?contacts[second] :'Unknown';
    return addNewChat!=="true"?(
      <div  style={{textDecoration:"none",cursor:'default'}}>
        <div className="SidebarSimple">
         
         <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
        
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center' }}>
        <Avatar style={{padding:"0 0px 0 0px"}}src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`}/>
          <Typography component="div" variant="h5" style={{fontWeight:'bold',fontSize:'12px',letterSpacing:0.7}}>
            {user==first?'You' : (contacts!=undefined && contacts[first]!=undefined)?contacts[first]: 'Unknown'}
          </Typography>
          <Typography variant="subtitle1" color="grey" component="div" >
          <Tooltip title={<div style={{fontSize:'10px'}}>{first}</div>} placement="right">
            <div style={{cursor:'alias',overflow:'hidden',textOverflow: "ellipsis",maxWidth:'40px'}}>
            {first}
            </div>
            </Tooltip>
          </Typography>
          
        </div>
    
      
      <div style={{ display:'flex',flexDirection:'column',alignItems:'right',width:'80%' }}>
        <Typography component="div" variant="h6" style={{fontFamily:"sans-serif",textAlign:'right'}}>
        {user!=first ? amount>0? `Owes ${other}`: amount==0 ?`is settled with ${other}`: `is owed by ${other}` :
        amount>0? `Owe ${other}`: amount==0 ?`are settled with ${other}`: `are owed by ${other}`
        }
        </Typography>
        <Typography variant="subtitle1" color="grey" component="div" style={{display:'flex',justifyContent:'right',textAlign:'right'}}  >
          <Tooltip title={<div style={{fontSize:'10px'}}>{second}</div>} placement="top-end">
            <div style={{cursor:'alias',overflow:'hidden',textOverflow: "ellipsis",textAlign:'right',alignItems:'right',maxWidth:'60px'}}>
            {second}
            </div>
            </Tooltip>
          </Typography>
      <Typography component="div" variant="h6" style={{marginLeft:'10px', display:amount==0?'none':'',fontWeight:'bold',letterSpacing:0.7,color:amount>0 ?'red': amount==0?'gray': 'green',textAlign:'right'}}>
      
            ETH {Math.abs(amount)}
          </Typography>
          <div style={{display:'flex',flexDirection:'row-reverse'}}>
          {(user==first && amount>0) && (<div   style={{width:'15%',height:'10%',cursor:'hover',backgroundColor:'#2196f3',color:'white',fontSize:11,textAlign:'center',paddingTop:'2%',paddingBottom:'2%',paddingLeft:'4px',paddingRight:'4px',borderRadius:'6px',cursor:'pointer'}} onClick={()=>{console.log("submit")}}> Pay</div>)}
          </div>
          </div>
          
         </div>
        </div>
        </div>
    ):(
        null
    )
}
export default MidbarSimple
