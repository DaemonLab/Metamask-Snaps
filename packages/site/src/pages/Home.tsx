import { FunctionComponent, ReactNode, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Footer, Header } from '../components';
import Sidebar from '../components/Sidebar';
import '../App.css';
import { GlobalStyle } from '../config/theme';
import { ToggleThemeContext } from '../Root';

import React, { useState } from 'react';
import Chat from '../components/Chat';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import Index from './index';
import Midbar from '../components/Midbar';
import { Box } from '@mui/system';
import Login from '../pages/Login';
import axios from 'axios';
import Midlay from './Midlay';
import Errorboundary from '../components/errorboundary';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;
const Home = ({ children, accessToken, toggleTheme, removeToken }: any) => {
  const navigate = useNavigate();
  const [comb, setComb] = useState({ rooms: [], contacts: null });
  const [isLoading, setIsloading] = useState(false);

  const combGetSet = async () => {
    try {
      const res = await axios.get('http://localhost:5000/group', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resContact = await axios.get('http://localhost:5000/contact', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = res.data;
      console.log('Data', data);
      console.log('Rooms', comb.rooms);

      console.log('Contact response', resContact);
      let reset = false;
      if (data.length !== comb.rooms.length) {
        reset = true;
      }
      if (
        comb.contacts == null ||
        Object.keys(comb.contacts).length != Object.keys(resContact.data).length
      )
        reset = true;
      if (reset) {
        console.log('Data unequal');
        setComb({
          rooms: data,
          contacts: resContact.data,
        });
      }
    } catch (err) {
      console.log(err);
      if (err.message === 'jwt expired') {
        localStorage.removeItem('access_token');
        navigate('/');
      }
    }
  };
  //   const getGroup=async()=>{
  //     try{
  //     const res=await axios.get(
  //       'http://localhost:5000/group',
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${accessToken}`
  //           }
  //     })
  //       const data=res.data;
  //       console.log('Data',data)
  //       console.log('Rooms', rooms)
  //       let reset=false;
  //       if(data.length!==rooms.length)
  //       {
  //         reset=true;
  //       }

  //       if(reset)
  //       {
  //         console.log('Data unequal')
  //         setRooms(data)
  //       }

  //       }
  //     catch(err)
  //     {
  //       console.log(err);
  //     }
  // }
  // const getContacts=async()=>{
  //   try{
  //     const res=await axios.get('http://localhost:5000/contact',{
  //                   headers: { 'Content-Type': 'application/json',
  //                   'Authorization': `Bearer ${accessToken}` }
  //                 })
  //           console.log("Contact response",res)
  //           if(contacts==null || Object.keys(contacts).length!=Object.keys(res.data).length)
  //           setContacts(res.data)
  //               }catch(err)
  //               {
  //                 console.log(err)
  //           if (err.message === 'jwt expired') {
  //             localStorage.removeItem('access_token');
  //             navigate('/login');
  //           }

  //               }
  // }
  useEffect(() => {
    // alert('Home rerendering')

    if (!localStorage.getItem('access_token')) {
      removeToken();
      navigate('/');
    }
  });
  useEffect(() => {
    setIsloading(true);
    combGetSet();
    setIsloading(false);
  });

  return (
    <Wrapper style={{ height: '100vh', overflow: 'hidden' }}>
      <Header handleToggleClick={toggleTheme} />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <div className="chat__body">
          <Errorboundary>
            <Sidebar
              rooms={comb.rooms}
              access={accessToken}
              loading={isLoading}
            />
          </Errorboundary>
          <Routes>
            <Route
              path="rooms/:roomId/*"
              element={
                <Midlay
                  rooms={comb.rooms}
                  access={accessToken}
                  contacts={comb.contacts}
                />
              }
            />
            {/* <Route  path="rooms/:roomId/transacts/:transactid" element={<Chat rooms={comb.rooms}  access={accessToken} contacts={comb.contacts}/>}/> */}
          </Routes>
        </div>
      </Box>
      // <Index />
      {/** wassnt initially there */}
      // {/*{children} for proab rendering index*/}
    </Wrapper>
  );
};
export default Home;
