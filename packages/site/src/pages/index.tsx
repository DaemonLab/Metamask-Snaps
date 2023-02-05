import { useContext } from 'react';
import React from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getaddress,
  getSnap,
  handleStorage,
  sendContractTransaction,
  sendHello,
  handleTestx,
  shouldDisplayReconnectButton,
  contractData,
  addjob,
  getjobs,
  clearState
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
  SendTransactButton,
} from '../components';
import './pages.css'
import { ethers } from 'ethers';
import { CLIEngine } from 'eslint';




const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [name, setname] = React.useState("");
  const [address, setaddress] = React.useState("");
  const [btc, setbtc] = React.useState("0");
  const [btcadd, setbtcadd] = React.useState("");
  const [to, setto] = React.useState("");
  const [myarr, setmyarr] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [inparr, setinparr] = React.useState([{}]);
  const [arr2, setarr2] = React.useState({})
  const [abi, setabi] = React.useState([])
  const [fname, setfname] = React.useState("");
  const [jobs, setjobs] = React.useState([]);
  const [frequency, setfrequency] = React.useState("")
  const [date, setdate] = React.useState("");
  const [timestamp, settimestamp] = React.useState(0);

  const handleOpen = () => {
    setOpen(!open);
  };


  const handleAdresses = async (e: any) => {
    getaddress();
  }

  interface AbiFunction {
    constant: boolean;
    inputs: { name: string; type: string }[];
    name: string;
    outputs: { name: string; type: string }[];
    payable: boolean;
    stateMutability: string;
    type: string;
  }
  //https://api.etherscan.io/api?module=contract&action=getabi&address=0x2835cb9900638263b574df95bc09f98910e15b12&apikey=NKU9ICH3P8KKU9ZV1UT6HZK4FUW9S77UXW
  const callFuncs = async (e: any) => {
    e.preventDefault();

    const abix  = await fetch(`https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=NKU9ICH3P8KKU9ZV1UT6HZK4FUW9S77UXW`)        
    const data = await abix.json()    
    console.log(data)    
    setabi(data)
    const resx = JSON.parse(data.result)
    // const data2 = "[{\"inputs\":[],\"name\":\"overflow\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"overflow2\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"overflow3\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]"
    // const datax = JSON.parse(data2)
    // const data3 = {"status":"1","message":"OK","result":"[{\"inputs\":[],\"name\":\"overflow\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"overflow2\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"overflow3\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]"}
    // console.log(data3)
    // setabi(data3)
    // console.log(datax)           
    const funcs = await resx.filter((func: any) => func.type === "function").map((func: any) => func);        
    setmyarr(funcs)
    setOpen(true)
    // getjobs().then((data: any) => {
    //   console.log(data.length)      
    // })
    // for (const obj of abi2) {
    //   // if (obj.type === "function") {
    //   //   console.log(`Function: ${obj.name}`);
    //   //   console.log("Parameters:");
    //   //   for (const input of obj.inputs) {
    //   //     console.log(`- Name: ${input.name}, Type: ${input.type}`);
    //   //   }
    //   // }
    //   console.log(obj)
    // }
    // const functions = data.filter(json => json.type === 'function');        
    
  }  

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

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleTranscation = async (e: any) => {
    e.preventDefault();

    try {
      await sendContractTransaction(to);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    handleStorage(name, address);
  }

  const handleSubmitBtc =async (e:any) => {
    e.preventDefault();

    const res = await fetch(`https://blockchain.info/q/addressbalance/${btcadd}?confirmations=3`)    
    let data = await res.json();
    console.log(data)
    setbtc(data)
  }

  const handleTest = async (e:any) => {
    e.preventDefault();
    handleTestx();
  }

  
  const handleClix = async(e: any, input: any, name: any) => {    
    setinparr(input)
    setfname(name)
  }  

  const handleFieldChange = (event : any) => {
    setarr2({ ...arr2, [event.target.name]: event.target.value });
  };

  const handleClear = async (e: any) => {
    e.preventDefault();

    await clearState();
    console.log("State cleared")
  } 
  
  const handleSubmitx = async (e: any) => {
    e.preventDefault();
    const timestamp = Math.floor(Date.now() / 1000);
    settimestamp(timestamp);
    console.log(arr2)
    console.log(abi)
    console.log(address)
    console.log(fname)
    console.log(date)
    await addjob(arr2,`${address}`, abi, fname, frequency, timestamp);
    // await contractData(arr2,`${address}`, abi, fname, date);
    getjobs().then((data: any) => {
      setjobs(data);
    })
  }

  

  return (
    <Container>
      <Heading>
        Welcome to <Span>template-snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        <Card
          content={{
            title: 'Send Hello message',
            description:
              'Display a custom message within a confirmation screen in MetaMask.',
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        {/* <Card
          content={{
            title: 'Send Insights',
            description:
              'Show insights in MetaMask.',
            button: (
              <SendTransactButton
                onClick={handleTranscation}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        /> */}
        <div className="cardx">
          <div className="form">
            <form className='formx' onSubmit={(e) => callFuncs(e)}>
              {/* <div className="formdiv">
                <label>From: </label>
                <br/>
                <input type="text" className='inputx' onChange={(e) => setfrom(e.target.value)}/>
              </div>
              <br/> */}
              <div className="formdiv">
                <label>To: </label>
                <br/>
                <input type="text" className='inputx'onChange={(e) => setaddress(e.target.value)}/>
              </div>
              <div className="formdiv">               
                <input type="submit" className='btnx' value="Send Transaction"/>
              </div>
            </form>
           
          </div>
        </div>
        <div className="cardx">
          <div className="form">
            <form className='formx' onSubmit={(e) => handleSubmit(e)}>
              <div className="formdiv">
                <label>Name: </label>
                <br/>
                <input type="text" className='inputx' onChange={(e) => setname(e.target.value)}/>
              </div>
              <br/>
              <div className="formdiv">
                <label>Adress: </label>
                <br/>
                <input type="text" className='inputx'onChange={(e) => setaddress(e.target.value)}/>
              </div>
              <div className="formdiv">               
                <input type="submit" className='btnx' value="Add Address"/>
              </div>
            </form>
          </div>
        </div>
        <div className="cardx2">
          <p style={{textAlign:'center'}}>Jobs</p>
          {
            jobs.map((obj: any, id: any) => {
              return(
                <div key={id} style={{border:"solid 1px white", borderRadius:'2px', padding:"5px"}} className="jobx">
                  <p>{obj.fname}</p>                  
                </div>
              )
            })
          }
        </div>
        <div className="cardx"> 
        <h6>Get Adresses</h6>
          <p className='crdtxt'>
            Click this button to get addresses in your address book.
          </p>         
           <button className="btnx btn2" onClick={(e) => handleClear(e)}>Clear State</button>          
        </div>           
        <div className="cardx3"> 
        <h6>Available Functions&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h6>
         <div className='c'>
          {myarr.map((obj: any, id: any) => {
            return(
              <div key={id} onClick={(e) => handleClix(e, obj.inputs, obj.name)} className="divxx">
                <p style={{marginLeft:'20px'}}>{obj.name}</p>
              </div>
            )            
          })}</div> 
                     
        </div>
        <div className="cardx3">
        <p align="center">Add Job</p> 
        <p align="center">{fname}</p> 
        <div className="form">          
            <form className='formx' onSubmit={(e) => handleSubmitx(e)}>
              {
                inparr.map((obj:any, id:any) => {
                  return(
                    <div className="formdiv" key={id}>
                      <label>{obj.name}</label>
                      <br/>
                      <input type="text" name={obj.name} className='inputx' onChange={handleFieldChange}/>
                    </div>
                  )
                })
              }      
              <div className="formdiv" >
                <label>Frequency</label>
                <br/>
                <input type="text" name="freq" className='inputx' onChange={(e) => setfrequency(e.target.value)}/>
              </div>                      
              <div className="formdiv">               
                <input type="submit" className='btnx' value="Send"/>
              </div>
            </form>
          </div>
        </div>        
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
