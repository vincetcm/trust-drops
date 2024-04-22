import React, { useState, useEffect, useContext } from 'react';
import { GiDropletSplash } from 'react-icons/gi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import LeaderBoardModal from './LeaderBoardModal';
import { DataContext } from '../context/DataContext';
import Mande from '../assets/mandeLogo.svg';

const ethers = require('ethers');

function Navbar() {
  const { pathname } = useLocation();
  console.log('pathname', pathname);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [activeRoute, setActiveRoute] = useState('');

  const { accountAddress, connectWallet } = useContext(DataContext);

  const formatAddress = (address) => {
    const maxLength = 14;
    return address.length > maxLength
      ? `${address.substring(0, 8)}...${address.substring(address.length - 4)}`
      : address;
  };
  const openLeaderBoard = () => {
    setOpenModal(true);
  };
  const closeModal = () => {
    setOpenModal(false);
  };
  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     try {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       await provider.send('eth_requestAccounts', []);
  //       const signer = provider.getSigner();
  //       const address = await signer.getAddress();
  //       setAccount(address);
  //       setAccountAddress(address);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     window.alert('Please install MetaMask!');
  //   }
  // };

  // useEffect(() => {
  //   const fetchAccount = async () => {
  //     if (window.ethereum) {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       try {
  //         // Get the list of accounts
  //         const accounts = await provider.listAccounts();
  //         if (accounts.length > 0) {
  //           const address = accounts[0];
  //           setAccount(address);
  //           setAccountAddress(address);
  //         }
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   };

  //   fetchAccount();
  // }, []);
  useEffect(() => {
    if (pathname == '/') {
      setActiveRoute('home');
    } else if (pathname == '/staking') {
      setActiveRoute('staking');
    } else if (pathname == '/leaderboard') {
      setActiveRoute('leaderboard');
    } else if (pathname == '/airdrop') {
      setActiveRoute('airdrop');
    }
  }, [pathname]);
  return (
    <div className='nav-container font-mono flex  justify-center  bg-black h-[10vh] '>
      <div className='flex-1 flex justify-between items-center max-w-[90%] '>
        <Link
          className='text-3xl font-semibold text-white flex items-center gap-2 tracking-wider'
          to={'/'}
        >
          <img src={Mande}></img> MANDE
        </Link>
        {/* {account ? ( */}
        <div className='navbar-left-container gap-8 flex items-center'>
          <Link
            to={'/'}
            className={`${
              activeRoute == 'home' ? 'text-[#7071E8] font-bold' : 'text-white'
            }   text-[18px]`}
            // onClick={openLeaderBoard}
          >
            Home
          </Link>
          <Link
            to={'/airdrop'}
            className={`${
              activeRoute == 'airdrop'
                ? 'text-[#7071E8] font-bold'
                : 'text-white'
            }   text-[18px]`}
            // onClick={openLeaderBoard}
          >
            Airdrop
          </Link>
          <Link
            to={'/staking'}
            className={`${
              activeRoute == 'staking'
                ? 'text-[#7071E8] font-bold'
                : 'text-white'
            }   text-[18px]`}
          >
            Credibility staking
          </Link>
          <Link
            to={'/leaderboard'}
            className={`${
              activeRoute == 'leaderboard'
                ? 'text-[#7071E8] font-bold'
                : 'text-white'
            }   text-[18px]`}
          >
            Leaderboard
          </Link>
          {accountAddress && accountAddress.length>0 && (<div className='wallet-address border-2 border-white px-2 text-[#7071E8] bg-white text-xl flex items-center '>
            {formatAddress(accountAddress)}
          </div>)}
          {!accountAddress && (
            <button
            className='button-container bg-white px-4 text-center py-2  w-[200px] text-black text-[18px]'
            onClick={connectWallet}
            >
              Connect wallet
            </button>
          )}
        </div>
      </div>
      {openModal && (
        <LeaderBoardModal closeModal={closeModal} />
      )}
    </div>
  );
}

export default Navbar;
