import { createContext, useState } from 'react';
import { ethers } from 'ethers';
import trustdropABI from '../abis/trustdropABI.json';
import daoTokenABI from '../abis/erc20ABI.json';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [accountAddress, setAccountAddress] = useState('');
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakedOnAddress, setStakedOnAddress] = useState('');

  const contractABI = trustdropABI.abi
  const CONTRACT_ADDRESS = "0x02dbD309e070d88e4EA9A18bc59b9b31ECDCDFD0"

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

  const erc20ABI = daoTokenABI.abi
  const erc20Address = "0xeb8E96B5cf725a76C5B579BeCA8aD027A6769513"
  const erc20Contract = new ethers.Contract(erc20Address, erc20ABI, signer);

  const data = {
    accountAddress,
    setAccountAddress,
    stakedAmount,
    setStakedAmount,
    stakedOnAddress,
    setStakedOnAddress,
    contract,
    erc20Contract
  }

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
