import React, { Fragment, useState } from "react";
import { Paper, Grid, Typography, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";



// clipPath: "polygon( 0 0,100% 0, 100% 100%, 0 calc(100% - 5vw) )",

const UserProfile=(props:any)=> {

  const formatPhone = (phoneNum:any) => {
    let numberPattern = /\d+/g;
    phoneNum = phoneNum.match(numberPattern).join("");
    return phoneNum;
  };
  console.log(props)
  return (
    <Fragment>
      
      <Paper elevation={0} style={{
         margin: "0px",
         boxShadow:
            "0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.07),0 16px 32px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.07)",
         width: "auto",
        height: "auto",
         borderRadius: "0%",
         backgroundColor:'black'
        }}
        sx={{backgroundColor: `${({ theme }:any) => theme.colors.background.alternative}`,}} >

        <div style={ {
      backgroundImage: "url(https://source.unsplash.com/random)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      
    }}>
          <img src={"https://randomuser.me/api/portraits/thumb/women/61.jpg"} style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "70px",
        borderRadius: "50%",
        position: "relative",
        top: "30px",
        border: "solid 7px #ffffff"
      }} />
        </div>
        <div id="content">
         
            <Grid item md={12} sm={12} xs={12}>
              <Typography variant="h5" gutterBottom>
                <Box textAlign="center">
                  {props.userData.name}
                </Box>
              </Typography>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Typography variant="h6" gutterBottom>
                <Box textAlign="center">{}</Box>
              </Typography>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Typography variant="overline" gutterBottom>
                <Box textAlign="center">
                  <LocationOnIcon /> &ensp; {},{" "}
                  {}
                </Box>
              </Typography>
            </Grid>
          
        </div>
      </Paper>
    </Fragment>
  );
}

export default UserProfile;
