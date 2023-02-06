import { useContext, useState } from 'react';
import styled from 'styled-components';
import { display } from '@mui/system';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendHello,
  addData,
  shouldDisplayReconnectButton,
  getData,
  deleteData,
  updateData,
  handleTestx,
  handleStorage,
  sendContractTransaction,
  getaddress,
  getTronAddressData,
  sendTron,
  getSolanaAddressData,
  sendSolana,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
} from '../components';
import Table from './tables';
import './pages.css';

import Web3 from 'web3';
import React from 'react';
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');




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

  const [name, setname] = React.useState("");
  const [address, setaddress] = React.useState("");
  const [btc, setbtc] = React.useState("0");
  const [btcadd, setbtcadd] = React.useState("");
  const [to, setto] = React.useState("");
  const handleAdresses = async (e: any) => {
    getaddress();
  }
  const refreshTable = () => {
    getData().then((data) => {
      console.log(data);
      if (data !== null) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        setJobs(data);
      }
    });
  };
  const [jobs, setJobs] = useState(() => refreshTable());

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

    const abix = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=NKU9ICH3P8KKU9ZV1UT6HZK4FUW9S77UXW`)
    const data = await abix.json()

    const resx = JSON.parse(data.result)
    resx.filter((func: any) => func.type === "function").map((func: any) => console.log(func.name));
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

  const handleSubmitBtc = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`https://blockchain.info/q/addressbalance/${btcadd}?confirmations=3`)
    let data = await res.json();
    console.log(data)
    setbtc(data)
  }

  const handleTest = async (e: any) => {
    e.preventDefault();
    handleTestx();
  }

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
                <br />
                <input type="text" className='inputx' onChange={(e) => setaddress(e.target.value)} />
              </div>
              <div className="formdiv">
                <input type="submit" className='btnx' value="Send Transaction" />
              </div>
            </form>

          </div>
        </div>
        <div className="cardx">
          <div className="form">
            <form className='formx' onSubmit={(e) => handleSubmit(e)}>
              <div className="formdiv">
                <label>Name: </label>
                <br />
                <input type="text" className='inputx' onChange={(e) => setname(e.target.value)} />
              </div>
              <br />
              <div className="formdiv">
                <label>Adress: </label>
                <br />
                <input type="text" className='inputx' onChange={(e) => setaddress(e.target.value)} />
              </div>
              <div className="formdiv">
                <input type="submit" className='btnx' value="Add Address" />
              </div>
            </form>
          </div>
        </div>
        <div className="cardx">
          <div className="form">
            <form className='formx' onSubmit={(e) => handleSubmitBtc(e)}>
              <div className="formdiv">
                <label>BTC Address: </label>
                <br />
                <input type="text" className='inputx' onChange={(e) => setbtcadd(e.target.value)} />
              </div>
              <div className="formdiv">
                <input type="submit" className='btnx' value="Get BTC Balance" />
              </div>
            </form>
            <p className='crdtxt'>
              {btc}
            </p>
          </div>
        </div>
        <div className="cardx">
          <h6>Get Adresses</h6>
          <p className='crdtxt'>
            Click this button to get addresses in your address book.
          </p>
          <button className="btnx btn2" onClick={(e) => handleAdresses(e)}>Get Adresses</button>
        </div>
        <div className="cardx">
          <h6>Test</h6>
          <p className='crdtxt'>
            Click this button to get addresses in your address book.
          </p>
          <button className="btnx btn2" onClick={(e) => handleTest(e)}>Get Adresses</button>
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
        data={jobs}
        deletefunc={handleDeleteDataClick}
        updatefunc={handleUpdateDataClick}
      />
    </Container>
  );
};

export default Index;
