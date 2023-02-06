import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Tooltip } from '@mui/material';

export default function Members({name,address,amount}:any) {


  return (
    <Card sx={{ display: 'flex',justifyContent:'space-between'}}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5" style={{fontWeight:'bold',letterSpacing:0.7}}>
            {name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            <Tooltip title={<div style={{fontSize:'10px'}}>{address}</div>}style={{fontSize:'18px'}} placement="top-end">
            <div style={{cursor:'alias',textOverflow: "ellipsis"}}>
            {address}
            </div>
            </Tooltip>
          </Typography>
          
        </CardContent>
        
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography component="div" variant="h6" style={{fontFamily:"sans-serif",color:amount>0 ?'red':amount==0?'gray':'green'}}>
        {amount>0? 'Owes': amount==0 ?'Settled Up': 'Gets back'}
        </Typography>
      <Typography component="div" variant="h5" style={{fontWeight:'bold',letterSpacing:0.7,color:amount>0 ?'red': amount==0?'gray': 'green',textAlign:'right'}}>
            
            ETH {Math.abs(amount)}
          </Typography>
          </CardContent>
          </Box>
    </Card>
  );
}