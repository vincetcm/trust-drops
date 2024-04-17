import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import trustdropABI from '../abis/trustdropABI.json';
import config from '../config.json';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [signer, setSigner] = useState({});
  const [accountAddress, setAccountAddress] = useState('');
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakedOnAddress, setStakedOnAddress] = useState('');

  const [feedItems, setFeedItems] = useState([]);

  // const contractABI = trustdropABI.abi
  // const CONTRACT_ADDRESS = "0xDB08bf5bcA3351ea80899CD15ab829963fD2dfc3"

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();
  // const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

  // const erc20ABI = daoTokenABI.abi
  // const erc20Address = "0x3229bbbec3dF4B0BDfA6B4ab99D177aA7d7E10A1"
  // const erc20Contract = new ethers.Contract(erc20Address, erc20ABI, signer);

  async function connectWallet() {
    if (window.ethereum) {
      if(window.ethereum._state.isUnlocked) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        if (chainId != config.network.chainId) {
          await window.ethereum.request({
            "method": "wallet_addEthereumChain",
            "params": [
              config.network
            ]
          });
        } else {
          console.log("already connected");
        }

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
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
