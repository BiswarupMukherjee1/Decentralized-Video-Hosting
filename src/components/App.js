import React, { Component } from 'react';
import DVideo from '../abis/DVideo.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';//Using WEB3JS to connect application with Blockchain
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
// Connecting application to ethereum blockchain from metamask
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
// Takes all info in from blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    //Load accounts
    const accounts=await web3.eth.getAccounts()//address for metamask
    //console.log(accounts)

    //Adding new objects to StateObject in React
    this.setState({ account: accounts[0] })
    //Add first account the the state

    //Get network ID
    const networkId = await web3.eth.net.getId()//Dynamic. can change
    //Get network data
    const networkData=DVideo.networks[networkId]//Specific network data from Dvideo.json networks
    
    //Check if net data exists, then
    if(networkData){
      const dvideo= new web3.eth.Contract(DVideo.abi,DVideo.networks[networkId].address)
     this.setState({dvideo})

     //FETCH VIDEOS
     const videosCount=await dvideo.methods.videoCount().call()
     //Load Videos, sort by newest
     for(var i=videosCount;i>=1;i--){
      const video=await dvideo.methods.videos(i).call()
      //Add all the videos to state
      this.setState({
        videos: [...this.state.videos,video]
      })
     }

     //Set the latest video with title to view as default
     const latest = await dvideo.methods.videos(videosCount).call()
      this.setState({
        currentHash: latest.hash,
        currentTitle: latest.title
      })
      this.setState({ loading: false})

    } else {
      window.alert('BVideo contract not deployed to detected network.')
    }
    
    
      //Assign dvideo contract to a variable
      //Add dvideo to the state

      //Check videoAmounts
      //Add videAmounts to the state

      //Iterate throught videos and add them to the state (by newest)


      //Set latest video and it's title to view as default 
      //Set loading state to false

      //If network data doesn't exisits, log error
  }

  //Get video. Prepare the file for Upload to IPFS
  captureFile = event => {
    //Create buffer of file
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    //Add to state
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  //Upload video
  uploadVideo = title => {
    console.log("Submitting file to IPFS...")

    ipfs.add(this.state.buffer,(error,result)=>{
      //Put on blockchain
      console.log('IPFS Result',result)
      if(error){
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.dvideo.methods.uploadVideo(result[0].hash, title).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  //Change Video
  changeVideo = (hash, title) => {
    this.setState({'currentHash': hash});
    this.setState({'currentTitle': title});
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      account: '',
      dvideo: null,
      videos: [],
      loading: true,
      currentHash: null,
      currentTitle: null
      //set states
    }

    //Bind functions
  }
// LAYOUT FOR ENTIRE PAGE
  render() {
    return (
      <div>
        <Navbar 
          //Account. Passing the account to NAVBAR
          account={this.state.account}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              //states&functions
              videos={this.state.videos}
              uploadVideo={this.uploadVideo}
              captureFile={this.captureFile}
              changeVideo={this.changeVideo}
              currentHash={this.state.currentHash}//To get currently played video
              currentTitle={this.state.currentTitle}
            />
        }
      </div>
    );
  }
}

export default App;