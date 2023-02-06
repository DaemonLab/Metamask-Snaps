import React from 'react'
import '../routepage.css'
import {Header} from '../components/Header'
import {Footer} from '../components/Footer'
// import SendImage from '../assets/send.jpeg';

export default function Route1Page() {
  return (

    <div className="mainbox">
      <Header handleToggleClick={function(): void {
              throw new Error('Function not implemented.')
          } }/>
      <div className="container">


        <div className="heading">
        <h1>Bitcoin</h1>
        </div>

        <div id="curr">
        <h5 className="sample">CURRENT BALANCE</h5>
        </div>

        <div className="heading">
        <span className="btc">--BTC</span>
        </div>
        <div className="mainarrowbox">
        
        <div className="arrowbox1">
          <img src="https://icons8.com/icon/42459/copy"/>
          
        </div>
        
        <div className="arrowbox2">

        </div>
        <br/>
        <span className="span1">SEND</span>
        <span className="span2">RECEIVE</span>
          </div>

          <div className="market">
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

              

            </div>


      </div>
<Footer/>

    </div>
  )
}
