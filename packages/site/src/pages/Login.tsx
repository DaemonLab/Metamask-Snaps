import React,{useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {login} from '../utils/snap'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/icons-material/Checkbox';
import Lottie from "react-lottie";

import Logo from "../assets/LoginBG.json"


const Login=({setToken,removeToken,accessToken}:any) =>{
    const paperStyle={padding :20,height:'15vh',width:280, margin:"20px auto",position :'absolute', bottom:0, left:0 , right: 0,marginLeft: 'auto',marginRight: 'auto', marginBottom:80}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    const navigate=useNavigate();
  useEffect(()=>{
    
    alert(`Login rerendering ${accessToken}`)
    
  
    if(localStorage.getItem("access_token"))
    {
       navigate('/home')
    }
  },)
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Logo,
    
  };
  return (
    <Grid 
    sx={ {backgroundColor: `${({ theme }:any) => theme.colors.background.alternative}`}}
    style={{height:'90vh'}}
    >
      <h2 style={{textAlign:'center', marginBottom:0  }}>Simplify</h2>
        <Lottie options={defaultOptions}    style={{ position:'parent' }} height={'70%'} width={'70%'}/>
            <Paper elevation={10} style={paperStyle} >
                <Grid alignItems='center'>
                     {/* <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar> */}
                    {/* <h2>Sign In</h2> */}
                </Grid>
               Lets begin the journey !!
                <Button type='submit' color='primary' variant="contained" style={btnstyle} onClick={async()=>{
                    console.log('Signing')
                    try{
                    await login()
                    setToken()
                    }
                    catch(err)
                    {
                        
                        console.log(err);
                        if(typeof err==='object')
                        alert('Signature Error')
                        else 
                        alert( err)
                        removeToken()
                    }
                }} fullWidth>Sign in</Button>
                
            </Paper>
        </Grid>
  )
}
export default Login;