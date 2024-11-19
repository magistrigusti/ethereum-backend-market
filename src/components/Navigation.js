import logo from '../assets/joker-logo.png';

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })
    setAccount(accounts[0]);
  }

  return (
    <nav>
      <ul className="nav__links">
        <li><a href="#">Buy</a></li>
        <li><a href="#">Rent</a></li>
        <li><a href="#">Sell</a></li>
      </ul>

      <div className="nav__brand">
        <img src={logo} alt="Logo" />
        <h1>M@gistriGusti</h1>
      </div>

      {account ? (
        <button className="nav__connect" type="button">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
        ) : (
          <button className="nav__connect" 
            onClick={connectHandler}
            type="button"
          >
            Connect
          </button>
        )
      }
    </nav>
  )
}

export default Navigation;
