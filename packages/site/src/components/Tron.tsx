import React, {useState, useEffect} from 'react'
import '../routepage.css'
import { useContext } from 'react';
import{
  sendTron,
  getTronAddressData,  
  getSolanaAddressData,
  exportTronPrivateKey,
  exportSolanaPrivateKey
} from '../utils/snap'
import { MetamaskActions, MetaMaskContext } from '../hooks';

const inputStyle={
  padding:'10px',
  margin:'2px',
  fontSize:'14px',
  fontFamily:'sans-serif'
}
export default function Tron() {


  const [tronFormData, setTronFormData] = useState({
    to: '',
    amount: ''
  });
  const [tronAccountData, setTronAccountData] = useState({
    publicKey: ' ',
    balance: 0
  })
  const [state, dispatch] = useContext(MetaMaskContext);

useEffect(() => {

  let token = localStorage.getItem('access_token');
      if (token == null)
        token = ''
  
  getTronAddressData(token).then((data) => {
    console.log(data);
    console.log('get tron data')

    setTronAccountData({
      publicKey: data.publicKey,
      balance: data.balance
    });
  })
  
}, [])


  const sendTronTransaction = async (data: any) => {
    try {
      console.log('new data');
      let token = localStorage.getItem('access_token');
      if (token == null)
        token = ''

      getTronAddressData(token).then((data) => {
        console.log(data);

        setTronAccountData({
          publicKey: data.publicKey,
          balance: data.balance
        });
      })
      data['token'] = token;
      await sendTron(data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };


  const[msg,setMsg]=useState();

  const handleTronExport = async () => {
    try {
      exportTronPrivateKey().then((data:any) => {

        console.log(data);
        //handle how the data has to be displayed
        setMsg(data)
      })
    } catch (error) {
      console.error(error);
    }
  }


    
  const onTronChange = (e: any) => {
    setTronFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  return (
    <div>
    <div id="curr" style={{marginTop:'50px'}}>
    <h5 className="sample">PUBLIC ADDRESS: {tronAccountData.publicKey}</h5>
    </div>

    <div className="heading" style={{marginTop:'20px'}}>
    <span className="btc">{tronAccountData.balance}</span>
    <span>&nbsp;&nbsp;TRON</span>
    </div>

    <div className="inputfields" >
      <div className="inputvalues" style={{fontSize:'15px'}}>
      <label style={{fontSize:'15px'}}htmlFor="address">Address : </label>
      <input id="address" style={inputStyle} className="value" name='to' onChange={onTronChange}/>
      </div>
      <div className="inputvalues" style={{fontSize:'15px'}}>
      <label  htmlFor="amount"  >Amount : </label>
      <input type="number" id="amount" style={inputStyle} className="value" name='amount' onChange={onTronChange}/>
      </div>
    </div>

    <div className="mainarrowbox">
    
    <div className="arrowbox1" style={{marginTop:'50px',marginLeft:'30%',width:'30%',cursor:'pointer'}} >
      {/* <img src="https://icons8.com/icon/42459/copy"/> */}

    <span className="span1" onClick={() => sendTronTransaction(tronFormData)}>SEND</span>
    </div>
    
   
    {/* <div className="arrowbox2">

    </div> */}
    <br/>
    {/* <span className="span2">RECEIVE</span> */}
      </div>

      {/* <div className="market">
        <span>
          MarketPrice:<span className="rupee"> 0 rupees</span>
        </span>

        <span className="topup">
          <button id="btn">
            TOP-UP
          </button>
          <button className="transaction" id="btn">
              ALL TRANSACTIONS
              </button>
          </span>

          

        </div> */}
       
    </div>
  )
}
