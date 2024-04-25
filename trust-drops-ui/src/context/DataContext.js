import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import trustdropABI from '../abis/trustdropABI.json';
import config from '../config.json';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [signer, setSigner] = useState({});
  const [provider, setProvider] = useState({});
  const [accountAddress, setAccountAddress] = useState('');
  const [trustdropContract, setTrustdropContract] = useState(null);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakedOnAddress, setStakedOnAddress] = useState('');
  const [feedItems, setFeedItems] = useState([]);
  
  useEffect(() => {
    if (accountAddress) {
      console.log("check addre here - ", process.env.REACT_APP_TRUSRDROPS_CONTRACT_ADDRESS);
      console.log("check signer here - ", signer);
      const contract = new ethers.Contract(process.env.REACT_APP_TRUSRDROPS_CONTRACT_ADDRESS, trustdropABI.abi, signer);
      setTrustdropContract(contract);
    }
  }, [accountAddress]);

  async function connectWallet() {
    if (window.ethereum) {
      if(window.ethereum._state.isUnlocked) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        if (chainId != config.networks.testnet.chainId) {
          await window.ethereum.request({
            "method": "wallet_addEthereumChain",
            "params": [
              config.networks.testnet
            ]
          });
        } else {
          console.log("already connected");
        }

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
        setProvider(provider);
        setAccountAddress(await signer.getAddress());
      } else {
        console.log(`Please unlock ${window.ethereum.isMetaMask ? "metamask" : "wallet"}`)
      }
    } else {
      console.log('EVM wallet not found')
    }
  }

  const data = {
    connectWallet,
    signer,
    accountAddress,
    trustdropContract,
    provider,
    // setAccountAddress,
    // stakedAmount,
    // setStakedAmount,
    // stakedOnAddress,
    // setStakedOnAddress,
    // contract,
    // erc20Contract,
    // feedItems,
    // setFeedItems,
    // messages,
    // setMessages,
    // sendMessage
  }

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
