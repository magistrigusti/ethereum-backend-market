import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Navigation from './components/Navigation';
import Search from './components/Search';
import RealEstate from './abis/RealEstate.json';
import Escrow from './abis/Escrow.json';
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [account, setAccount] = useState(null);
  const [homes, setHomes] = useState([]); // Инициализация как пустой массив

  const loadBlockchainData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      console.log("Provider initialized:", provider);

      const network = await provider.getNetwork();
      console.log("Network:", network);

      const realEstateAddress = config[network.chainId]?.realEstate?.address;
      const escrowAddress = config[network.chainId]?.escrow?.address;
      if (!realEstateAddress || !escrowAddress) {
        throw new Error(`Addresses for RealEstate or Escrow not found in config for network: ${network.chainId}`);
      }

      const realEstate = new ethers.Contract(realEstateAddress, RealEstate.abi, provider);
      console.log("RealEstate Contract:", realEstate);

      const totalSupply = await realEstate.totalSupply();
      console.log("Total Supply:", totalSupply.toString());

      const homesArray = []; // Используйте другое имя для временного массива

      for (let i = 1; i <= totalSupply; i++) {
        const uri = await realEstate.tokenURI(i);
        console.log("Token URI:", uri);
        const response = await fetch(uri);
        if (response.ok) {
          const metadata = await response.json();
          console.log("Metadata:", metadata);
          homesArray.push(metadata);
        } else {
          console.error("Failed to fetch metadata for token URI:", uri);
        }
      }

      console.log("Homes Metadata:", homesArray);
      setHomes(homesArray);

      const escrow = new ethers.Contract(escrowAddress, Escrow.abi, provider);
      console.log("Escrow Contract:", escrow);
      setEscrow(escrow);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log("Accounts:", accounts);
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);

      window.ethereum.on('accountsChanged', async () => {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log("Accounts changed:", accounts);
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
      });

    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Search />
      <div className='cards__section'>
        <h3>Homes for you</h3> 
        <hr />
        <div className="cards">
          {Array.isArray(homes) && homes.length > 0 ? homes.map((home, index) => (
            <div className="card" key={index}>
              <div className="card__image">
                <img src={home.image || "https://via.placeholder.com/150"} alt="Home" />
              </div>
              <div className="card__info">
                <h4>{home.attributes && home.attributes[0] ? home.attributes[0].value : "N/A"} ETH</h4>
                <p>
                  <strong>{home.attributes && home.attributes[2] ? home.attributes[2].value : "N/A"}</strong> bds |
                  <strong>{home.attributes && home.attributes[3] ? home.attributes[3].value : "N/A"}</strong> ba |
                  <strong>{home.attributes && home.attributes[4] ? home.attributes[4].value : "N/A"}</strong> sqft
                </p>
                <p>{home.address || "N/A"}</p>
              </div>
            </div>
          )) : <p>Loading homes...</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
