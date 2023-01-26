import * as React from 'react';
import {useState} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import { ButtonGroup } from '@mui/material';
import { SettingsInputAntennaTwoTone } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));


const Table=({data}:any)=> {
  const [dense, setDense] =useState(false);
  const [open, setOpen] = useState(false);
  const [formData,setFormData]=useState({name:"",address:"",id:"",date:new Date,amount:"", active:'false'})
  const handleClickOpen = (num:number) => {
  setFormData(data[num])
    setOpen(true);
  };
  
  const handleClose = () => {
    console.log(formData)
    setOpen(false);
  };

  const onChange=(e:any)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.name]: e.target.value

    }))
  }
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 , width:'40%'}}>
    
        <Grid item xs={12} md={6} >
          <Typography sx={{ mt: 4, mb: 2 }} variant="h4" component="div">
            Transactions
          </Typography>
          <Demo>
            <List dense={dense} sx={{bgcolor:'black'}}>
             {
              data.map((item:any,num:number)=>{
                return(
                <ListItem
                secondaryAction={
                  <ButtonGroup  >
                      <IconButton edge="end" aria-label="create" size="large" color="primary"
                       onClick={()=>{
                        handleClickOpen(num)
                       }}>
                  <CreateIcon fontSize='inherit'/>
                  
                </IconButton>
                  <IconButton edge="end" aria-label="delete" size="large"color="primary" onClick={()=>{console.log('delete')}}>
                    <DeleteIcon fontSize='inherit' />
                    
                  </IconButton>
                  
                </ButtonGroup>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{bgcolor: item.amount>0?'green' : 'red'}}>
                    <ReceiptIcon fontSize='large' />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText

                  primary={item.name}
                  
                  secondary={ item.amount}
                />
              </ListItem>
                )
             })}
               
        
            </List>
          </Demo>
        </Grid>
        <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
         
        <div className="" style={{
          display: "flex",
          flexDirection:"column",
          rowGap:4
          
        }}>
            <div style={
              {
                fontSize: 26,
                fontWeight: "bold",
                textAlign:"center",
                marginBottom:10,
                marginTop:10
              }
            }>Payment</div>
            <div className="" style={{
              display:"flex",
              alignItems:"center",
              columnGap:3,
              rowGap:4
              }}>
                <input style={{height:24}} placeholder='Name' name="name" type='text' value={formData.name} onChange={onChange}/>
            </div>   
            <div className=""
            style={{
              display:"flex",
              alignItems:"center",
              columnGap:3
              }}>
           <input style={{height:24}}  placeholder='Address' name="address" type='text' value={formData.address} onChange={onChange}/>  
              </div>     
               
            <input style={{height:24}} placeholder='ID' name="id" type='text' value={formData.id} onChange={onChange}/>      
            <input style={{height:24}}  placeholder='AMount' name="amount" type='number' value={formData.amount} onChange={onChange}/>      
            <input style={{height:24}}  placeholder='Date' name="date" type='date' onChange={onChange}/>      
            
            </div>
        
      
        </DialogContent>
        <DialogActions>
          <Button onClick={
           
            handleClose
            }>Submit</Button>
        
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default Table;
