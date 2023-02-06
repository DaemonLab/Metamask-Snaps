import React,{useState,useEffect} from 'react'
import "./sidebarchat.css"
import { Avatar } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MidbarSimple =(props: any)=> {
  // calling from anaother page and rendering props
  const { addNewChat, amount, first, second} = props;
  const [messages, setMessages] = useState('');  
  //generating random avatar
    const[seed,setSeed]=useState<any|null>("");
    useEffect(() => {
    setSeed(Math.floor(Math.random()*5000))
    }, [])
  
    return addNewChat!=="true"?(
      <div  style={{textDecoration:"none",cursor:'default'}}>
        <div className="SidebarSimple">
         
         <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
        
        <div style={{ display:'flex',flexDirection:'column',alignItems:'center' }}>
        <Avatar style={{padding:"0 0px 0 0px"}}src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`}/>
          <Typography component="div" variant="h5" style={{fontWeight:'bold',letterSpacing:0.7}}>
            {first}
          </Typography>
          <Typography variant="subtitle1" color="grey" component="div" >
          <Tooltip title={<div style={{fontSize:'10px'}}>Address</div>} placement="right">
            <div style={{cursor:'alias',textOverflow: "ellipsis"}}>
            Address
            </div>
            </Tooltip>
          </Typography>
          
        </div>
    
      
      <div style={{ display:'flex',flexDirection:'column',alignItems:'right',width:'100%' }}>
        <Typography component="div" variant="h6" style={{fontFamily:"sans-serif",textAlign:'right'}}>
        {amount>0? `Owes ${second}`: amount==0 ?`Settled Up with ${second}`: `Gives ${second} back `}
        </Typography>
        <Typography variant="subtitle1" color="grey" component="div" >
          <Tooltip title={<div style={{fontSize:'10px'}}>{second}</div>} placement="top-end">
            <div style={{cursor:'alias',textOverflow: "ellipsis",textAlign:'right'}}>
            Address
            </div>
            </Tooltip>
          </Typography>
      <Typography component="div" variant="h6" style={{marginLeft:'10px', display:amount==0?'none':'',fontWeight:'bold',letterSpacing:0.7,color:amount>0 ?'red': amount==0?'gray': 'green',textAlign:'right'}}>
      
            ETH {Math.abs(amount)}
          </Typography>
          </div>
          
         </div>
        </div>
        </div>
    ):(
        null
    )
}
export default MidbarSimple
