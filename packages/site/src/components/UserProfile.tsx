import React, { Fragment, useState } from "react";
import { Paper, Grid, Typography, Box, Tooltip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./sidebar.css"
import background from "../assets/bg.png";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from "axios";
import { useNavigate } from "react-router-dom";
// clipPath: "polygon( 0 0,100% 0, 100% 100%, 0 calc(100% - 5vw) )",

const UserProfile=({userData,access}:any)=> {

  const navigate=useNavigate();

 //console.log(userData)
  return (
    <Fragment >
      
      <Paper elevation={8} style={{
         margin: "0px",
          width: "auto",
        height: "auto",
        
         
        }}
        sx={{backgroundColor: `${({ theme }:any) => theme.colors.background.alternative}`,}} >

        <div style={ {
      backgroundImage: `url(${background})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      
      
    }}>
      <Paper elevation={3} style={{ display: "flex",
      justifyContent:'space-between',
        width: "auto",
        padding: '10px',
        height: '40px',
        backgroundColor:'#2a2f32',
        borderRadius:0
        }}>
          <div style={{marginTop:'auto', marginBottom:'auto',color:'white'}}>
      <b className="TEXT">{userData && userData.name}</b>
        
        </div>
        <div className="Sidebar__headerRight"  style={{fontFamily:'bold', alignItems:"center",
    lineHeight: "14px",
    fontSize:"11px",
    color: "#B1B3B5"}}>
          Date: {userData && userData.date}
          <div style={{display: "block",
        cursor:'pointer',
        marginLeft: "2%",
        marginRight: "auto",}}>
          <Tooltip title="Delete Split">
          <DeleteForeverIcon style={{
        
     
        borderRadius: "50%",
    
        color:"#B1B3B5",
        
        fontSize:"24px",
        
      }}
         onClick={async()=>{
          const res=await axios.delete(`https://knotty-calendar-production.up.railway.app/split/${userData.groupId}/${userData.id}`, {
            headers: { 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access}` }
            });
            console.log("Delete", res);
            navigate('/home')
         }}/>
         </Tooltip>
         </div>
        </div>
       
      </Paper>
      
          <ReceiptLongIcon  style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "70px",
        borderRadius: "50%",
        position: "relative",
        top: "30px",
        border: "solid 7px #ffffff",
        color:'white',
        backgroundColor:'grey',
        padding:'4px',
        fontSize:"70px",
        
      }} />
        </div>
        
      </Paper>
    </Fragment>
  );
}

export default UserProfile;
