import React, {useState, useEffect} from 'react'
import { useContext } from 'react';
import{
  sendSolana,
  getSolanaAddressData,  
  exportSolanaPrivateKey
} from '../utils/snap'
import { MetamaskActions, MetaMaskContext } from '../hooks';
const inputStyle={
  padding:'10px',
  margin:'2px',
  fontSize:'14px',
  fontFamily:'sans-serif'
}
export default function Solona() {

  const [solanaFormData, setSolanaFormData] = useState({
    to: '',
    amount: ''
  });
  const [solanaAccountData, setSolanaAccountData] = useState({
    publicAddress: '',
    balance: 0
  });
  const [state, dispatch] = useContext(MetaMaskContext);

  useEffect(() => {
    
    //localStorage.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHgzMDljZDg3M2QxNWIwN2NiOTZhYTBjMDllNDAzYmM1YWFlM2YzNDllIiwiaWF0IjoxNjc1Nzc1NTg1LCJleHAiOjE2NzU3NzkxODV9.auIgd_-kkhhrhV9NX5783AzFYo9x0LaP6vhzIn4uwuw');
    console.log(localStorage.getItem('access_token'));
    let token = localStorage.getItem('access_token');
    if (token == null)
      token = ''

    getSolanaAddressData(token).then((data) => {
      console.log(data);

      setSolanaAccountData({
        publicAddress: data.publicAddress,
        balance: data.balance
      });
    })

  }, [])
  
  
  const sendSolanaTransaction = async (data: any) => {
    try {
      console.log('new data');
      //localStorage.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHgzMDljZDg3M2QxNWIwN2NiOTZhYTBjMDllNDAzYmM1YWFlM2YzNDllIiwiaWF0IjoxNjc1Nzc1NTg1LCJleHAiOjE2NzU3NzkxODV9.auIgd_-kkhhrhV9NX5783AzFYo9x0LaP6vhzIn4uwuw');
      console.log(localStorage.getItem('access_token'));
      let token = localStorage.getItem('access_token');
      if (token == null)
        token = ''

      getSolanaAddressData(token).then((data) => {
        console.log(data);

        setSolanaAccountData({
          publicAddress: data.publicAddress,
          balance: data.balance
        });
      })
      data['token'] = token;
      await sendSolana(data);
    } catch (e) {
      console.error(e);

      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };
   
  const handleSolanaExport = async () => {
    try {
      exportSolanaPrivateKey().then((data) => {
        console.log(data);
        //handle how the data has to be displayed

      })
    } catch (error) {
      console.error(error);
    }
  }
  const onSolanaChange = (e: any) => {
    setSolanaFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  return (
    <div>
    <div id="curr" style={{marginTop:'50px'}}>
    <h5 className="sample">PUBLIC ADDRESS: {solanaAccountData.publicAddress}</h5>
    </div>

    <div className="heading" style={{marginTop:'20px'}}>
    <span className="btc">{solanaAccountData.balance}</span>
    <span>&nbsp;&nbsp;SOLONA</span>
    </div>

    <div className="inputfields">
      <div className="inputvalues" style={{fontSize:'15px'}}>
      <label htmlFor="address">Address : </label>
      <input id="address" style={inputStyle} name='to' onChange={onSolanaChange} className="value"/>
      </div>
      <div className="inputvalues" style={{fontSize:'15px'}}>
      <label htmlFor="amount">Amount : </label>
      <input type="number" style={inputStyle} id="amount" name='amount' onChange={onSolanaChange} className="value"/>
      </div>
    </div>

    <div className="mainarrowbox">
    
    <div className="arrowbox1" style={{marginTop:'50px',marginLeft:'30%',width:'30%'}}>
      {/* <img src="https://icons8.com/icon/42459/copy"/> */}

    <span className="span1" onClick={() => sendSolanaTransaction(solanaFormData)}>SEND</span>
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
