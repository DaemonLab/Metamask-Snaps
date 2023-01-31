import { FunctionComponent, ReactNode, useContext } from 'react';
import styled from 'styled-components';
import { Footer, Header } from './components';
import Sidebar from './components/Sidebar'
import './App.css';
import { GlobalStyle } from './config/theme';
import { ToggleThemeContext } from './Root';

import React,{useState} from 'react';
import Chat from './components/Chat'
import { BrowserRouter , Routes, Route } from "react-router-dom";
import { useStateValue } from "./login/StateProvider";
import Midbar from './components/Midbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

export type AppProps = {
  children: ReactNode;
};

export const App: FunctionComponent<AppProps> = ({ children }) => {
  const toggleTheme = useContext(ToggleThemeContext);

  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header handleToggleClick={toggleTheme} />
      <div className="chat__body">
      <Sidebar/>
      <Routes>
              <Route  path="/rooms/:roomId" element={<Midbar />}/>
              <Route  path="/rooms/:roomId/transacts/:transactid" element={<Chat />}/>
              {/* <Route  path="/rooms/:roomId" element={<Chat />} /> */}
      </Routes>
      </div>
      {children}
      <Wrapper>
    
        <Footer />
      </Wrapper>
    </BrowserRouter>
  );
};
