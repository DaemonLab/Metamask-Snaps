import { useContext,useState, useEffect } from 'react';
import styled from 'styled-components';
import Table from './tables'
import { MetamaskActions, MetaMaskContext } from '../hooks';
import Sidebar from '../components/Sidebar';
import {
  connectSnap,
  getSnap,
  sendHello,
  addData,
  shouldDisplayReconnectButton,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
} from '../components';

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
  useEffect(()=>{
    // 0x309cd873d15b07cb96aa0c09e403bc5aae3f349alert('Index rendering')
  },)
  const [state, dispatch] = useContext(MetaMaskContext);
  const [formData,setFormData]=useState({name:"",address:"",id:"",date:new Date,amount:"", active:'false'})
  const transaction=[{name:"test1",address:"",id:"1",date:new Date,amount:"", active:true},
  {name:"test2",address:"",id:"2",date:new Date,amount:"10", active:false},
  {name:"test3",address:"",id:"3",date:new Date,amount:"0", active:false}]
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

  const handleAddDataClick = async (data:any) => {
    try {
      await addData(data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const onChange=(e:any)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.name]: e.target.value

    }))
  }

  return (
    <>
   
    <Container>
      <Heading>
        hello
      </Heading>
      <Subtitle>
       startting
      </Subtitle>
    
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {/* {!state.isFlask && (
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
        )} */}
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
       
        <div style={{
          display: "flex",
          flexDirection:"column",
          backgroundColor:'black',
          padding:6,
          paddingLeft:16,
          paddingRight:16,
          rowGap:16,
          border:'1px solid white',
          borderRadius: 25
          
          
          
        }}>
            
            
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
            <button style={{marginBottom:6}}  className = "submitBtn" onClick={()=>{console.log(formData)}}> submit</button>
        </div>
      </CardContainer>
      <Table data={transaction}  />
    </Container>
    </>
  );
};

export default Index;
