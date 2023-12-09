import { createContext, useState } from 'react';
import { ethers } from 'ethers';
import trustdropABI from '../contracts/trustdropABI.json';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [accountAddress, setAccountAddress] = useState('');
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakedOnAddress, setStakedOnAddress] = useState('');

  const contractABI = trustdropABI.abi
  const CONTRACT_ADDRESS = "0xDB08bf5bcA3351ea80899CD15ab829963fD2dfc3"

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

  const data = {
    accountAddress,
    setAccountAddress,
    stakedAmount,
    setStakedAmount,
    stakedOnAddress,
    setStakedOnAddress,
    contract
  }

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
