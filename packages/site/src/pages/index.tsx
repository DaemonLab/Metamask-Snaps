import { useContext, useEffect, useState } from 'react';
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
  clearState,
  disable,
  addData,
  deleteData,
  updateData,
  getSolanaAddressData,
  getTronAddressData,
  sendSolana,
  sendTron,
  getData
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
  SendTransactButton,
} from '../components';
import './pages.css';
import { ethers } from 'ethers';
import { CLIEngine } from 'eslint';
import { Contract } from 'alchemy-sdk';
import Table from './tables';

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
  const [address, setaddress] = React.useState('');
  const [myarr, setmyarr] = React.useState([]);
  const [open, setOpen] = React.useState(false);
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

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    id: '',
    date: new Date(),
    amount: '',
    active: true,
    lastPayment: -1
  });

  const [tronFormData, setTronFormData] = useState({
    to: '',
    amount: ''
  });
  const [solanaFormData, setSolanaFormData] = useState({
    to: '',
    amount: ''
  });
  const [tronAccountData, setTronAccountData] = useState({
    publicKey: ' ',
    balance: 0
  })
  const [solanaAccountData, setSolanaAccountData] = useState({
    publicAddress: ' ',
    balance: 0
  })

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



  // React.useEffect(() => {
  //   (async () => {
  //     if(state.installedSnap){

  //       getjobs().then((data: any) => {
  //         setjobs(data)
  //       })
  //     }
  //   })();
  // }, [state.installedSnap]);
  
  //https://api.etherscan.io/api?module=contract&action=getabi&address=0x2835cb9900638263b574df95bc09f98910e15b12&apikey=NKU9ICH3P8KKU9ZV1UT6HZK4FUW9S77UXW
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
    setOpen(true);
  };

  const handleAddDataClick = async (data: any) => {
    try {
      await addData(data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
    refreshTable();
  };

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
    await addjob(namex, arr2, `${address}`,  abi, fname, frequency, timestamp);
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

  const onChange = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  const sendTronTransaction = async (data: any) => {
    try {
      console.log('new data');

      getTronAddressData().then((data) => {
        console.log(data);

        setTronAccountData({
          publicKey: data.publicKey,
          balance: data.balance
        });
      })
      await sendTron(data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const sendSolanaTransaction = async (data: any) => {
    try {
      console.log('new data');

      getSolanaAddressData().then((data) => {
        console.log(data);

        setSolanaAccountData({
          publicAddress: data.publicAddress,
          balance: data.balance
        });
      })
      await sendSolana(data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };
  const handleTronFormSubmit = (event: any) => {
    event.preventDefault();
  }
  const handleSolanaFormSubmit = (event: any) => {
    event.preventDefault();
  }

  const onTronChange = (e: any) => {
    setTronFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSolanaChange = (e: any) => {
    setSolanaFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };



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
        <h6>Enter the Contract Address</h6>
          <div className="form">
            <form className="formx" onSubmit={(e) => callFuncs(e)}>
              {/* <div className="formdiv">
                <label>From: </label>
                <br/>
                <input type="text" className='inputx' onChange={(e) => setfrom(e.target.value)}/>
              </div>
              <br/> */}
              <div className="formdiv">
                <label>Contract Address: </label>
                <br />
                <input
                  type="text"
                  className="inputx"
                  onChange={(e) => setaddress(e.target.value)}
                />
              </div>
              <div className="formdiv">
                <input
                  type="submit"
                  className="btnx"
                  value="View Functions"
                />
              </div>
            </form>
          </div>
        </div>        
        <div className="cardx2">
          <h6>All Jobs</h6>
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
        <div className="cardx2">
          <h6>Remove All Jobs</h6>
          <p className="crdtxt">
            Click this button to remove all your jobs both active and disabled.
          </p>
          <button className="btnx btn2" onClick={(e) => handleClear(e)}>
            Remove Jobs
          </button>
        </div>
        <div className="cardx3" style={{overflowY:'scroll'}}>
          <h6>Available Functions&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h6>
          <div className="c">
            {myarr.map((obj: any, id: any) => {
              return (
                <div
                  key={id}
                  onClick={(e) => handleClix(e, obj.inputs, obj.name)}
                  className="divxx"
                >
                  <p style={{ marginLeft: '20px' }}>{obj.name}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="cardx3" style={{overflowY:'scroll'}}>
          <h6>Add Job</h6>
          <p align="center">{fname}</p>
          
          <div className="form">
            {show ? (
              <form className="formx" onSubmit={(e) => handleSubmitx(e)}>
                <div className="formdiv">
                  <label>Name</label>
                  <br />
                  <p className='warn'>*Name should be unique for all jobs</p>
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
                  <input
                    type="text"
                    name="freq"
                    className="inputx"
                    onChange={(e) => setfrequency(e.target.value)}
                  />
                </div>
                <div className="formdiv">
                  <input type="submit" className="btnx" value="Send" />
                </div>
              </form>
            ) : (
              <></>
            )}
          </div>
        </div>
        
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'black',
            padding: 6,
            paddingLeft: 16,
            paddingRight: 16,
            rowGap: 16,
            border: '1px solid white',
            borderRadius: 25,
          }}
        >
          <div
            className=""
            style={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 4,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Payment
            </div>
            <div
              className=""
              style={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 3,
                rowGap: 4,
              }}
            >
              <input
                style={{ height: 24 }}
                placeholder="Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={onChange}
              />
            </div>
            <div
              className=""
              style={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 3,
              }}
            >
              <input
                style={{ height: 24 }}
                placeholder="Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={onChange}
              />
            </div>

            <input
              style={{ height: 24 }}
              placeholder="ID"
              name="id"
              type="text"
              value={formData.id}
              onChange={onChange}
            />
            <input
              style={{ height: 24 }}
              placeholder="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={onChange}
            />
            <input
              style={{ height: 24 }}
              placeholder="Date"
              name="date"
              type="date"
              onChange={onChange}
            />
          </div>
          <button
            style={{ marginBottom: 6 }}
            className="submitBtn"
            onClick={() => {
              console.log(formData);
              handleAddDataClick(formData);
            }}
          >
            {' '}
            submit
          </button>
        </div>

        <div className="cardx3 cardx">
          <div className="form cardx-form">
            <h6>Tron</h6>
            <p className='crdtxt cardx-p'>
              Public Address:
            </p>
            <p>{tronAccountData.publicKey}</p>
            <p className='crdtxt cardx-p'>
              Balance:
            </p>
            <p>{tronAccountData.balance}</p>
            <form className='formx' onSubmit={handleTronFormSubmit} >

              <div className="formdiv">
                <label>Receiver's Tron Address: </label>
                <br />
                <input type="text" name='to' onChange={onTronChange} className='inputx' />
              </div>
              <div className="formdiv">
                <label>Amount: </label>
                <br />
                <input type="text" name='amount' onChange={onTronChange} className='inputx' />
              </div>
              <div className="formdiv">
                <input type="submit" className='btnx' value="Send" onClick={() => sendTronTransaction(tronFormData)} />
              </div>
            </form>

          </div>
        </div>
        <div className="cardx3 cardx ">
          <div className="form cardx-form">
            <h6>Solana</h6>
            <p className='crdtxt cardx-p'>
              Public Address
            </p>
            <p>{solanaAccountData.publicAddress}</p>
            <p className='crdtxt cardx-p'>
              Balance:
            </p>
            <p>{solanaAccountData.balance}</p>
            <form className='formx' onSubmit={handleSolanaFormSubmit} >

              <div className="formdiv">
                <label>Receiver's Solana Address: </label>
                <br />
                <input type="text" className='inputx' name='to' onChange={onSolanaChange} />
              </div>
              <div className="formdiv">
                <label>Amount: </label>
                <br />
                <input type="text" className='inputx' name='amount' onChange={onSolanaChange} />
              </div>
              <div className="formdiv">
                <input type="submit" className='btnx' value="Send" onClick={() => sendSolanaTransaction(solanaFormData)} />
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
      <Table
        data={payments}
        deletefunc={handleDeleteDataClick}
        updatefunc={handleUpdateDataClick}
      />
    </Container>
  );
};

export default Index;
