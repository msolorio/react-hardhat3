import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import './App.css';

// Local Hardhat testnet
const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

function App() {
  const [inputVal, setInputVal] = useState('');

  const handleInputChange = (event) => {
    setInputVal(event.target.value);
  }


  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  const fetchGreeting = async () => {
    console.log('fetchGreeting');

    if (!window.ethereum) return;

    // The provider is a read-only abstraction to access the blockchain data
    // Web3Provider wraps the standard browser provider coming from window.ethereum
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Creates an instance of a contract that we can intereact with
    const contract = new ethers.Contract(contractAddress, Greeter.abi, provider);

    try {
      const greeting = await contract.greet();

      console.log('greeting: ', greeting);
    } catch(err) {
      console.log('Error fetching contract ==>', err);
    }
  }


  const updateGreeting = async () => {
    if (!inputVal) return;
    if (!window.ethereum) return;

    await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Gets current account from MetaMask
    const signer = provider.getSigner();

    // Signer passed to contract instance to allow signing of transactions with contract
    const contract = new ethers.Contract(contractAddress, Greeter.abi, signer);

    const transaction = await contract.setGreeting(inputVal);

    // Why do we have to wait if we are already awaiting above ?
    await transaction.wait();

    fetchGreeting();
  }


  return (
    <div className="App">
      <h1>Greeter App</h1>

      <input
        type="button"
        value="Fetch Greeting" 
        onClick={fetchGreeting}
      />
      {' '}
      <input
        type="button"
        value="Update Greeting" 
        onClick={updateGreeting}
      />

      <br />
      <br />

      <input 
        type="text" 
        value={inputVal}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default App;
