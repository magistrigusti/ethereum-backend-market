import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'
import config from './config.json';

function App() {
  const [account, setAccount] = useState(null);
  const loadBlockchanData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({
        methos: 'eth_requestAccounts'
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    })
  }

  useEffect(() => {
    loadBlockchanData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />
      <div className='cards__section'>

        <h3>Homes for you</h3>

      </div>

    </div>
  );
}

export default App;
