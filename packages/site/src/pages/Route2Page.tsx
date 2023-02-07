import React, { useEffect, useContext } from 'react'
import {Header} from '../components/Header'
import {Footer} from '../components/Footer'
import styled from 'styled-components';
import { BrowserRouter , Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { MetaMaskContext } from '../hooks';
import Divider from '@mui/material/Divider';
import i1 from '../assets/contract.jpg'
import {  
  addjob,
  getjobs,
  clearState,
  disable,    
} from '../utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;
export default function Route2Page({ children ,accessToken,toggleTheme,removeToken}:any) {
  const navigate= useNavigate();

  const [state, dispatch] = useContext(MetaMaskContext);
  const [address, setaddress] = React.useState('');
  const [myarr, setmyarr] = React.useState([]);  
  const [inparr, setinparr] = React.useState([{}]);
  const [arr2, setarr2] = React.useState({});
  const [abi, setabi] = React.useState([]);
  const [fname, setfname] = React.useState('');
  const [jobs, setjobs] = React.useState([]);
  const [frequency, setfrequency] = React.useState('');
  const [timestamp, settimestamp] = React.useState(0);
  const [namex, setnamex] = React.useState('');
  const [show, setshow] = React.useState(false);
  const [load, setload] = React.useState(0)  
  const [gas, setgas] = React.useState('');
  const [show2, setshow2]= React.useState(0)

  useEffect(()=>{
    // alert('Home rerendering')
   
    if(!localStorage.getItem("access_token"))
        {
        removeToken()
        navigate('/')
        }              
    },)

    const callFuncs = async (e: any) => {
      e.preventDefault();

      const abix = await fetch(
        `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=NKU9ICH3P8KKU9ZV1UT6HZK4FUW9S77UXW`,
      );
      const data = await abix.json();
      console.log(data);
      setabi(data);
      const resx = JSON.parse(data.result);
      
      const funcs = await resx
        .filter((func: any) => func.type === 'function')
        .map((func: any) => func);
        setmyarr(funcs);                  
        setshow2(1)

    };

    const handleClix = async (e: any, input: any, name: any) => {
      setinparr(input);
      setfname(name);
      setshow(true);
    };
  
    const handleFieldChange = (event: any) => {
      setarr2({ ...arr2, [event.target.name]: event.target.value });
    };
  
    const handleClear = async (e: any) => {
      e.preventDefault();
  
      await clearState();
      console.log('State cleared');
    };
    
  
    const handleSubmitx = async (e: any) => {
      e.preventDefault();
      const timestamp = Math.floor(Date.now() / 1000);
      settimestamp(timestamp);    
      await addjob(namex, arr2, `${address}`,  abi, fname, frequency,gas, timestamp);
      // await contractData(namex, arr2, `${address}`,publick,  abi ,fname, frequency)
      getjobs().then((data: any) => {
        setjobs(data);
      });
    };
  
    const changeJob = async (e: any, namez: any) => {
      setload(1);
      e.preventDefault();
      await disable(namez);
      getjobs().then((data: any) => {
        setjobs(data);
      });
      setload(0)
    };
  


const inputStyle={
  padding:'10px',
  margin:'2px',
  fontSize:'14px',
  fontFamily:'sans-serif'
}
  return (
    <Wrapper style={{height:'100vh',overflow:'hidden'}} >
    <Header handleToggleClick={toggleTheme} />
    <div className="mainbox2" style={{height:'95vh',overflow:'hidden'}}>
      {/* <img src={i1} style={{position:'absolute',top:'35%',left:'45%',height:'420px'}}/> */}
    <div className="container2" style={{overflowY:'scroll',height:'80vh', marginTop:'25px',overflowX:'hidden'}}>


      <div className="heading" style={{textAlign:'center'}}>
      <h3>Enter the contract Address</h3>
      </div>

      <div className="inputfields">
      <div className="inputvalues">
      <label htmlFor="address">Contract Address: </label>
      <br/>
      <input id="address" style={inputStyle} className="value" onChange={(e) => setaddress(e.target.value)}/>
      </div>

      <div className='btn'>
        {address!==''?
          <button className='func' onClick={(e) => callFuncs(e)}>
          View Functions
          </button>
          :
          <button style={{backgroundColor: "gray",color:'white',cursor:'default'}}>
          View Functions
          </button>
        }
        
      </div>
  </div>
  {
    show2 ? (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
      <div className='mainfunc' style={{width:'110vh'}} >
          <div className='availablefunc' style={{paddingTop:'20px'}}>
              <div className="functions" >
                <span className='headingfunc' >Available Functions</span>                
                  {myarr.map((obj: any, id: any) => {
                  return (
                    <div
                      key={id}
                      onClick={(e) => handleClix(e, obj.inputs, obj.name)}
                      className="divxx"
                    >
                      <p style={{ marginLeft: '20px' }}>{obj.name}</p>
                      <Divider/>
                    </div>

                  );
                })}
              </div>
            </div>            
        <div className='addjob' style={{paddingTop:'20px'}}>
          <div className="functions">
                <span className='headingfunc2'>Add Job</span>
                <div className='jobs'>
                {show ? (
              <form className="formx" onSubmit={(e) => handleSubmitx(e)}>
                <div className="formdiv">
                  
                  <label style={{marginBottom:'20px'}}>Name</label>                  
                  <p className='warn' style={{margin:'0'}}>*Name should be unique for all jobs</p>                
                  <input
                    type="text"
                    name="namex"
                    className="inputx"
                    onChange={(e) => setnamex(e.target.value)}
                  />                    
                  
                </div>
                {inparr.map((obj: any, id: any) => {
                  return (
                    <div className="formdiv" key={id}>
                      <label>{obj.name}</label>
                      <br />
                      <input
                        type="text"
                        name={obj.name}
                        className="inputx"
                        onChange={handleFieldChange}
                      />
                    </div>
                  );
                })}                
                <div className="formdiv">
                  <label>Frequency</label>
                  <br />
                  {/* <br /> */}
                  {/* <br /> */}
                  <input
                    type="text"
                    name="freq"
                    className="inputx"
                    onChange={(e) => setfrequency(e.target.value)}
                  />
                </div>                
                <div className="btn2">
                  <input type="submit" className="func" value="Send" />
                </div>
              </form>
            ) : (
              <></>
            )}
            </div>
              </div>
            
            </div>

        </div>
        <div className='addjob' style={{height:'50vh',marginTop:'30px',width:'85vh',overflowY:'scroll'}} >
        <p className='headingfunc3'>All Jobs</p>      
          {jobs.map((obj: any, id: any) => {
            return (
              <div
                key={id}
                style={{
                  border: 'solid 1px white',
                  borderRadius: '2px',
                  padding: '5px',
                  display: 'flex',
                }}
                className="jobx"
              >
                <p style={{padding:'10px 0px', paddingLeft:'10px'}}>
                  {obj.name} - {obj.active ? <>Active</> : <>Disabled</>}
                </p>
                {obj.active ? (
                  <>
                  {load ? (
                    <button className="disbtn" disabled onClick={(e) => changeJob(e, obj.name)}>
                      Disable
                    </button>
                  ):(
                    <button className="disbtn" onClick={(e) => changeJob(e, obj.name)}>
                      Disable
                    </button>
                  )}
                  </>
                ) : (
                  <>
                  {load ? (
                    <button className="disbtn" disabled onClick={(e) => changeJob(e, obj.name)}>
                      Enable
                    </button>
                  ):(
                    <button className="disbtn" onClick={(e) => changeJob(e, obj.name)}>
                      Enable
                    </button>
                  )}
                  </>
                )}
              </div>
            );
          })}          
        </div>
        </div>
    ):(<></>)
  }  
    </div>
    </div>  
  </Wrapper>
  )
}
