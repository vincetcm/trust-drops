import React, { useState, useEffect } from 'react';
import { GiDropletSplash } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
const ethers = require('ethers');

function Navbar() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);

  const formatAddress = (address) => {
    const maxLength = 14;
    return address.length > maxLength
      ? `${address.substring(0, 8)}...${address.substring(address.length - 4)}`
      : address;
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error(error);
      }
    } else {
      window.alert('Please install MetaMask!');
    }
  };

  useEffect(() => {
    const fetchAccount = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          // Get the list of accounts
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const address = accounts[0];
            setAccount(address);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchAccount();
  }, []);

  return (
    <div className='nav-container font-mono flex p-4 justify-center bg-[#7071E8]'>
      <div className='flex-1 flex justify-between items-center max-w-[90%]'>
        <div className='text-3xl font-semibold text-white flex items-center gap-2'>
          <GiDropletSplash />
          Trustdrops
        </div>
        {account ? (
          <div className='wallet-address border-2 border-white px-2 text-[#7071E8] bg-white text-xl'>
            {formatAddress(account)}
          </div>
        ) : (
          <button
            className='text-white px-4 py-2 border-2 border-white text-xl  bg-[#7071E8]'
            onClick={connectWallet}
          >
            Connect wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
