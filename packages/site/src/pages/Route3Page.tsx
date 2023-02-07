import React, { useEffect, useContext, useState} from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import styled from 'styled-components';
import '../routepage.css'
import { MetamaskActions } from '../hooks';
import {   
  getData, 
  deleteData,
  updateData,  
} from '../utils';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { MetaMaskContext } from '../hooks';
import { addjob, getjobs, clearState, disable, addData } from '../utils';
import Table from './tables';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;
export default function Route3Page({
  children,
  accessToken,
  toggleTheme,
  removeToken,
}: any) {
  const navigate = useNavigate();  
  
  const [state, dispatch] = useContext(MetaMaskContext);
  
  const refreshTable = () => {    
    getData().then((data) => {
      console.log(data);
      if (data !== null) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        setPayments(data);
      }
    });
  };
  const [payments, setPayments] = useState(() => refreshTable());
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    id: '',
    date: new Date(),
    amount: '',
    active: true,
    lastPayment: -1
  });
  
  
  const handleDeleteDataClick = async (data: any) => {
    try {
      await deleteData(data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
    console.log('done');
    refreshTable();
  };

  const handleUpdateDataClick = async (data: any) => {
    try {
      await updateData(data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
    console.log('done');
    refreshTable();
  };

  const onChange = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  const handleAddDataClick = async (data: any) => {
    try {
      console.log('added');
      
      await addData(data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
    refreshTable();
  };

  useEffect(() => {
    // alert('Home rerendering')

    if (!localStorage.getItem('access_token')) {
      removeToken();
      navigate('/');
    }
  });
      
  const inputStyle = {
    padding: '10px',
    margin: '2px',
    fontSize: '14px',
    fontFamily: 'sans-serif',
  };
  return (
    <Wrapper style={{ height: '100vh', overflow: 'hidden' }}>
      <Header handleToggleClick={toggleTheme} />
      <div className="mainbox2" style={{ height: '95vh', overflow: 'hidden' }}>
        <div
          className="container2"
          style={{
            overflowY: 'scroll',
            height: '80vh',
            marginTop: '25px',
            overflowX: 'hidden',
          }}
        >
          <div className="heading" style={{ textAlign: 'center' }}>
            <h3>Enter the contract Address</h3>
          </div>

          <div className="inputfields">
            <div className='fields'>
            <div className="inputvalues">
              <label htmlFor="name">Name: </label>
              <input
                name="name"
                style={inputStyle}
                className="values"
                onChange={onChange}
              />
            </div>
            <div className="inputvalues">
              <label htmlFor="address">Address: </label>
              <input
                name="address"
                style={inputStyle}
                className="values"
                onChange={onChange}
              />
            </div>
            <div className="inputvalues">
              <label htmlFor="amount">Amount : </label>
              <input
                name="amount"
                style={inputStyle}
                className="values"
                onChange={onChange}
              />
            </div>
            <div className="inputvalues">
              <label htmlFor="date">Date : </label>
              <input
                name="date"
                type="date"
                style={inputStyle}
                className="values"
                onChange={onChange}
              />
            </div>

          </div>

            <div className="btn3">
              <button className="func" onClick={(e) => handleAddDataClick(formData)}>
                Add payment
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              </div>
              <div style={{display:'flex', justifyContent:'center'}}>
        <Table
          data={payments}
          deletefunc={handleDeleteDataClick}
          updatefunc={handleUpdateDataClick}
        />
      </div>
          </div>
        </div>
      </div>
      
    </Wrapper>
  );
}
