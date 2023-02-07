import { useContext,useState} from 'react';
import styled, { useTheme } from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getThemePreference, getSnap } from '../utils';
import { HeaderButtons } from './Buttons';
import { NavLink } from 'react-router-dom';

import { SnapLogo } from './SnapLogo';
import { Toggle } from './Toggle';
import '../App.css';
import './Header.css'
// import {
//   AppBar,
//   Toolbar,
//   CssBaseline,
//   Typography,
//   makeStyles,
// } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.default};
`;
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #131c21',
  boxShadow: 24,
  borderRadius:'5%',
  p: 4,
  height:'60vh',
  backgroundColor:"#0b1012",
};
const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 2rem;
  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;



export const Header = ({
  handleToggleClick,
}: {
  handleToggleClick(): void;
}) => {
  const theme = useTheme();
  const [state, dispatch] = useContext(MetaMaskContext);
  const [value, setValue] = useState(0);
  const navigate=useNavigate();
 

  
  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };
  return (
   
      <div style={{ 
      backgroundColor: '#1e2024',
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems:'center',
      padding:'0.6%',
      lineHeight: "60px"}}>
        <LogoWrapper style={{marginLeft:'4%'}}>
        <SnapLogo color={theme.colors.icon.default} size={36} />
        <Title>Simplify</Title>
      </LogoWrapper>
        <div style={{display:'flex',width:'40%',minWidth:'800px',justifyContent:'flex-end', marginRight:'3%',alignItems:'center'}}>
      
    
     <div style={{display:'flex',flexDirection:'row',width:'80%',justifyContent:'space-around',fontSize:'16px',letterSpacing:0.7, }}>
        <NavLink to="/home" >
          <button style={{backgroundColor:'inherit',border:'0.01em #2b2d33 solid',color:'inherit',width:'120px'}}>
          Home 
          </button>
        </NavLink>
        <NavLink to="/route1" 
        >
        <button style={{backgroundColor:'inherit',border:'0.01em #2b2d33 solid',borderRadius:'10px',color:'inherit',width:'120px'}}>
          Non ETH
          </button>
        </NavLink>
        <NavLink   to="/route2">
        <button style={{backgroundColor:'inherit',border:'0.01em #2b2d33 solid',color:'inherit',width:'150px'}}>
          Smart Contract
          </button>
        </NavLink>
        <NavLink  to="/route3">
        <button style={{backgroundColor:'inherit',border:'0.01em #2b2d33 solid',color:'inherit',width:'150px'}}>
          Recurring Payment
          </button>
        </NavLink>
        
        </div>
        <RightContainer style={{alignItems:'center',marginLeft:'3%'}}>
        {/* <Toggle
          onToggle={handleToggleClick}
          defaultChecked={getThemePreference()}
        /> */}
    
        <HeaderButtons state={state} onConnectClick={handleConnectClick} />
      </RightContainer>
        </div>
      {/* <h1>hiii</h1> */}
      
      </div>
  );
};
