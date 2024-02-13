import './App.css';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
// import { InjectedConnector } from 'wagmi/connectors/injected';
import { InjectedConnector } from 'wagmi/connectors';
import { jsonRpcProvider } from 'wagmi/provider/jsonRpc';
import 'bootstrap/dist/css/bootstrap.min.css';


const { chains, publicClient } = configureChains(
  [mainnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://mainnet.walletconnect.org/0000000000000000000000000000000000000000/00f9bf9e697ca8332a30d4a71f4c7d5e"
      }),
    })
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnected: true,
      }
    })
  ]
});

function Profile() {
  const { address } = useAccount();
  const { connect, isConnecting } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { data, isError, isLoading } = useBalance({
    address: address,
  });

  if (address) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='text-center'>
          <p>Connect to {address}</p>
          <p>Balance: {data ? data.formatted : "Loading..."} ETH </p>
          <p> Chain ID: {config ? config.latestUsedChained : ""}</p>
          <button className='btn btn-primary mt-3' onClick={disconnect}>Disconnect</button>
        </div>
      </div>
    );
  }
  

  if (isConnecting) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <p>Connecting...</p>
      </div>
    );
  }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      {/* <button className='btn btn-primary' onClick={() => connect()}>Connect Wallet</button> */}
      <button className='btn btn-primary' onClick={connect}>Connect Wallet</button>
    </div>
  );
}

function App() {
  return (
    // <WagmiConfig config={config}>
      <Profile />
    // </WagmiConfig>
  );
}

export default App;
