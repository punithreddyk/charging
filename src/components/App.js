import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Charging from '../abis/Charging.json'
import Navbar from './navbar'
import Main from './main'

class App extends Component {

  async componentWillMount(){
    await this.loadweb3()
    await this.loadBlockchainData()
  }

  async loadweb3(){
      // Modern dapp browsers...
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
              await window.ethereum.enable()
            }
      // Legacy dapp browsers...
      else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
      }
      // Non-dapp browsers...
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
  }

  async loadBlockchainData(){
    const web3 =window.web3
    //load acc
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Charging.networks[networkId]
    if(networkData) {
      const charging = web3.eth.Contract(Charging.abi, networkData.address)
      this.setState({charging})
      const stationCount = await charging.methods.stationCount().call()
      console.log(stationCount)
       // Load stations
       for (var i = 1; i <= stationCount; i++) {
        const station = await charging.methods.stations(i).call()
        this.setState({
          stations: [...this.state.stations, station]
        })
      }
      this.setState({loading: false})
      
    } else {
      window.alert('Charging contract not deployed to detected network.')
    }
  }

  constructor(props){
    super(props)
    this.state ={
      account: '',
      stationCount: 0,
      stations: [],
      loading: true,
      timer: 37
    }
    this.createStation = this.createStation.bind(this)
    this.purchasegas = this.purchasegas.bind(this)
  }
     createStation(name, price) {
     this.setState({ loading: true })
      this.state.charging.methods.createStation(name, price).send({ from: this.state.account })
      .once('receipt', (receipt) => {
      this.setState({ loading: false })
      })
     } 

     purchasegas(id, price) {
      this.setState({ loading: true })
      this.state.charging.methods.purchasegas(id).send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
    }

  
  render() {
    const { loading, timer } = this.state;
  
    if (loading ) {
      setTimeout(() => {
        this.setState((prevState) => ({
          timer: prevState.timer - 1
        }));
      }, 1000);
    }
  
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {loading && timer > 0 ? (
                <div id="loader" className="text-center">
                  <p className="text-center">Loading...</p>
                  <p style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '90vh',
                  width: '90vw',
                  fontSize: '40px'
                }}>{timer}</p>
                </div>
              ) : (
                <Main
                  stations={this.state.stations}
                  createStation={this.createStation}
                  purchasegas={this.purchasegas}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
