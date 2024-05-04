import React, { useState, useEffect, useContext } from 'react';
import LeaderBoardModal from '../components/LeaderBoardModal';
import Navbar from '../components/Navbar';
import { PiCopySimpleBold } from 'react-icons/pi';
import { MdOutlineLeaderboard, MdOutlineVerifiedUser } from 'react-icons/md';
import { FaRegUserCircle, FaRegDotCircle } from 'react-icons/fa';
import { IoLockClosedOutline } from 'react-icons/io5';
import { TbUserUp } from 'react-icons/tb';
import { FaRegSmileWink } from 'react-icons/fa';
import { RiLiveLine } from 'react-icons/ri';
import { ethers } from 'ethers';
import trustdropABI from '../abis/trustdropABI.json';
import { createClient, cacheExchange, fetchExchange } from 'urql';
import ClipLoader from 'react-spinners/ClipLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

import {
  LockClosedIcon,
  LockOpenIcon,
  EyeIcon,
} from '@heroicons/react/outline';

import { DataContext } from '../context/DataContext';
import RankIcon from '../assets/rankIcon.svg';
import CredibilityScoreIcon from '../assets/credibilityScoreIcon.svg';
import MandeLogo from '../assets/mandeLogo.svg';
import AvailableMandeIcon from '../assets/availableMandIcon.svg';
import LockedMand from '../assets/lockedMandIcon.svg';
import UnlockedMand from '../assets/unlockedMandIcon.svg';
import infoIcon from '../assets/infoIcon.svg';
import { motion } from 'framer-motion';
import { gql } from '@urql/core';

moment.updateLocale('en', {
  relativeTime: {
    future: (diff) => (diff == 'Just now' ? diff : `in ${diff}`),
    past: (diff) => (diff == 'Just now' ? diff : `${diff} ago`),
    s: 'Just now',
    ss: 'Just now',
    m: 'a min',
    mm: '%d mins',
  },
});

function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [isStaking, setIsStaking] = useState(true);
  const [activeTab, setActiveTab] = useState('Your Stakes');

  const [stakedBalance, setStakedBalance] = useState(0);
  const [credScore, setCredScore] = useState(0);
  const [allocatedTokens, setAllocatedTokens] = useState(0);
  const [stakesData, setStakesData] = useState([]);
  const [receivedData, setReceivedData] = useState([]);
  const [mandBalance, setMandBalance] = useState(0);
  const [userRank, setUserRank] = useState(0);

  const [stakeForAddress, setStakeForAddress] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');

  const [loadingStakeTx, setLoadingStakeTx] = useState(false);
  const [loadingUnstakeTx, setLoadingUnstakeTx] = useState(false);
  const [loadingClaimTx, setLoadingClaimTx] = useState(false);

  const { accountAddress, trustdropContract, provider, connectWallet } =
    useContext(DataContext);

  console.log('accountAddress', accountAddress);

  // const stakesData = [
  //   {
  //     address: '0xadfe20xadfe20xadfe20xadfe20xadfe20xadfe20xadfe20xadfe2',
  //     stake: '100.00 $DAO',
  //     credibility: '10.00',
  //   },
  //   {
  //     address: '0xadfe20xadfe20xadfe20xadfe20xadfe20xadfe20xadfe20xadfe2',
  //     stake: '400.00 $DAO',
  //     credibility: '40.00',
  //   },
  //   { address: '0xadfe2...f15d2', stake: '25.00 $DAO', credibility: '5.00' },
  //   { address: '0xadfe2...f135d', stake: '16.00 $DAO', credibility: '4.00' },
  // ];

  // const receivedData = [
  //   {
  //     address: '0xadfe2...f15d4',
  //     received: '120.00 $DAO',
  //     credibilityGained: '15.00',
  //   },
  // ];
  const formatAddress = (address) => {
    const maxLength = 18;
    return address.length > maxLength
      ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
      : address;
  };
  const truncateAmount = (amount) => {
    const formattedAmount = ethers.utils.formatUnits(amount);
    return (+formattedAmount).toFixed(4);
  };

  const copyToClipboard = async (wallet) => {
    try {
      await navigator.clipboard.writeText(wallet);
      toast.success('Address copied!');
    } catch (err) {
      // Handle the error case
    }
  };

  const handleStake = async () => {
    if (!accountAddress) {
      await connectWallet();
    }
    if (!ethers.utils.isAddress(stakeForAddress)) {
      toast.error('Please enter valid address');
      return;
    }
    if (!stakeAmount) {
      toast.error('Please enter valid amount');
      return;
    }
    setLoadingStakeTx(true);
    try {
      // const estimation = await trustdropContract.estimateGas.stake(
      //   stakeForAddress,
      //   {value: ethers.utils.parseUnits(stakeAmount)}
      // );
      console.log('check contract - ', trustdropContract);
      const stakeTx = await trustdropContract.stake(stakeForAddress, {
        value: ethers.utils.parseUnits(stakeAmount),
        // gasPrice: estimation,
      });
      await stakeTx.wait();

      console.log('Stake transaction hash', stakeTx.hash);
      console.log('Stake function executed');
      toast.success('Stake successfull');
      setLoadingStakeTx(false);
    } catch (e) {
      console.log(e);
      if (e && e.data && e.data.message) {
        toast.error(e.data.message);
      } else {
        const err = JSON.stringify(e);
        toast.error(JSON.parse(err).reason);
      }
      setLoadingStakeTx(false);
    }
  };

  const handleUnstake = async () => {
    if (!accountAddress) {
      await connectWallet();
    }
    if (!ethers.utils.isAddress(stakeForAddress)) {
      toast.error('Please enter valid address');
      return;
    }
    if (!stakeAmount) {
      toast.error('Please enter valid amount');
      return;
    }
    setLoadingUnstakeTx(true);
    console.log(stakeForAddress, ethers.utils.parseUnits(stakeAmount));
    // const estimation = await trustdropContract.estimateGas.unstake(
    //   stakeForAddress,
    //   ethers.utils.parseUnits(stakeAmount)
    // );
    try {
      const unstakeTx = await trustdropContract.unstake(
        stakeForAddress,
        ethers.utils.parseUnits(stakeAmount)
        // {
        //   gasPrice: estimation,
        // }
      );
      await unstakeTx.wait();

      console.log('Stake transaction hash', unstakeTx.hash);
      console.log('Unstake function executed');
      toast.success('Unstake successfull');
      setLoadingUnstakeTx(false);
    } catch (e) {
      console.log(e);
      if (e && e.data && e.data.message) {
        toast.error(e.data.message);
      } else {
        const err = JSON.stringify(e);
        toast.error(JSON.parse(err).reason);
      }
      setLoadingUnstakeTx(false);
    }
  };

  const LiveFeedCard = (props) => {
    return (
      <div
        className='live-feed-container h-[60px]   min-w-[280px] max-w-[30%]
     flex rounded-full   items-center mb-4  bg-white gap-2 px-2 '
      >
        {props.data.type == 'Staked' && (
          <img src={LockedMand} className='icon-container h-10 w-10' />
        )}
        {props.data.type == 'Unstaked' && (
          <img src={UnlockedMand} className='icon-container h-10 w-10' />
        )}
        <div className='data-container  flex flex-col  flex-1'>
          <div className='top-container flex text-black gap-2 items-center justify-between pr-2 '>
            <div className='left-container'>
              <div className='fromAddress text-[16px]  font-semibold text-black'>
                {formatAddress(props.data.staker)}
              </div>{' '}
            </div>
            <div className='icon-super-container  items-center gap-2'>
              <div className='icon-container flex items-center gap-2'>
                <img src={MandeLogo} className='icon-container h-6' />
                <span className='font-bold'>
                  {parseFloat(
                    ethers.utils.formatUnits(props.data.amount)
                  ).toFixed(2)}
                </span>
              </div>
              <div className='time text-[14px]  text-slate-500'>
                {moment(
                  parseInt(props.data.timestamp.toString()) * 1000
                ).fromNow()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleClaim = async () => {
    if (!accountAddress) {
      await connectWallet();
    }
    if (allocatedTokens == 0) {
      toast.error('No rewards to claim');
      return;
    }
    console.log('Claim function executed');
    setLoadingClaimTx(true);
    // const estimation = await trustdropContract.estimateGas.claimTokens();
    try {
      const claimTx = await trustdropContract.claimTokens();

      await claimTx.wait();
      console.log('Claim transaction hash', claimTx.hash);
      toast.success('Claim successfull');
      setLoadingClaimTx(false);
      setAllocatedTokens(0.0);
    } catch (e) {
      setLoadingClaimTx(false);
      if (e && e.data && e.data.message) {
        toast.error(e.data.message);
      } else {
        const err = JSON.stringify(e);
        toast.error(JSON.parse(err).reason);
      }
      console.log('claim failed');
    }
  };

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
  };
  const openLeaderBoard = () => {
    setOpenModal(true);
  };
  const closeModal = () => {
    setOpenModal(false);
  };

  async function loadUserData() {
    console.log('loading user data');

    try {
      fetch(`${process.env.REACT_APP_API_URL}userRank/${accountAddress}`)
        .then((response) => response.json())
        .then((data) => setUserRank(data.rank))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log('could not fetch user details');
    }

    try {
      const stakesSentQuery = gql`
        query GetStakesSent($address: String!) {
          stakes(where: { staker_: { id: $address } }) {
            amount
            credScore
            candidate {
              id
            }
          }
        }
      `;

      const client = createClient({
        url: process.env.REACT_APP_SUBGRAPH_API,
        exchanges: [cacheExchange, fetchExchange],
      });

      const data = await client
        .query(stakesSentQuery, { address: accountAddress })
        .toPromise();
      const stakesData = data.data.stakes.toReversed().map((data) => {
        return {
          address: data.candidate.id,
          stake: parseFloat(ethers.utils.formatUnits(data.amount)).toFixed(2),
          credibility: parseFloat(data.credScore).toFixed(2),
        };
      });
      setStakesData(stakesData);
    } catch (err) {
      console.log('check err stakesData -  ', err);
    }

    try {
      const stakesSentQuery = gql`
        query GetStakesSent($address: String!) {
          stakes(where: { candidate_: { id: $address } }) {
            amount
            credScore
            staker {
              id
            }
          }
        }
      `;

      const client = createClient({
        url: process.env.REACT_APP_SUBGRAPH_API,
        exchanges: [cacheExchange, fetchExchange],
      });

      const data = await client
        .query(stakesSentQuery, { address: accountAddress })
        .toPromise();
      const receivedData = data.data.stakes.toReversed().map((data) => {
        return {
          address: data.staker.id,
          received: parseFloat(ethers.utils.formatUnits(data.amount)).toFixed(
            2
          ),
          credibilityGained: parseFloat(data.credScore).toFixed(2),
        };
      });
      setReceivedData(receivedData);
    } catch (err) {
      console.log('check err receivedData -  ', err);
    }

    let credScore;
    try {
      const stakedTokens = await trustdropContract.totalStakedByUser(
        accountAddress
      );
      setStakedBalance(truncateAmount(stakedTokens));

      credScore = await trustdropContract.reputation(accountAddress);
      setCredScore(credScore.toString());
    } catch (err) {
      console.log('stake and cred fetcing failed -  ', err);
    }

    try {
      const allocation = await trustdropContract.allocation(accountAddress);
      setAllocatedTokens(truncateAmount(allocation));
    } catch (err) {
      console.log('check err setAllocatedTokens -  ', err);
    }

    try {
      let mandBalance = await provider.getBalance(accountAddress);
      setMandBalance(truncateAmount(mandBalance));
    } catch (err) {
      console.log('check err setMandBalance -  ', err);
    }
  }

  useEffect(() => {
    if (trustdropContract && accountAddress) {
      loadUserData();
    }
  }, [trustdropContract, accountAddress]);

  return (
    <motion.main
      initial={{ y: -5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className='  w-full  font-mono bg-black  text-white pb-5'>
        <div className='flex flex-col items-center  '>
          <div className='dashboard-container  w-[90%]  mt-4 '>
            <div className='top-container flex flex-col '>
              <div className='heading-container font-bold text-[32px]'>
                Credibilty staking
              </div>
              <div className='description-container text-slate-400'>
                Boost your credibility and earn more rewards!
              </div>
            </div>
          </div>
          <div className='main-container  flex flex-col md:flex-row justify-between gap-4 mt-4 w-[90%]'>
            <div className='credibility-staking-container  bg-[rgba(112,113,232,0.03)] border-2  border-[#7071E8] p-4 md:p-5 shadow-md w-[40%] mb-4 md:mb-0 '>
              <h1 className='text-2xl font-bold mb-4  text-[#7071E8] uppercase'>
                Stake on Trust
              </h1>
              <p className='text-sm mb-4'>
                Boost your credibility score and earn more rewards! Ask friends
                to stake their $MAND tokens on your address. The more stake you
                get, the better your credibility score. Use this interface below
                to Stake on your friends and help them earn more credibility
                score too!
              </p>

              <div className='flex  mb-4'>
                <button
                  onClick={() => setIsStaking(true)}
                  className={` px-2  ${
                    isStaking
                      ? 'bg-[#7071E8] text-white'
                      : 'bg-white border-2 text-[#7071E8] border-[#7071E8]'
                  }`}
                >
                  Stake
                </button>
                <button
                  onClick={() => setIsStaking(false)}
                  className={`  px-2 ${
                    !isStaking
                      ? 'bg-[#7071E8] text-white'
                      : 'bg-white border-2 text-[#7071E8] border-[#7071E8]'
                  }`}
                >
                  Unstake
                </button>
              </div>

              <div className='flex flex-col gap-2 mb-4'>
                {isStaking ? (
                  <>
                    <label htmlFor='address' className='font-semibold'>
                      Stake for address
                    </label>
                    <input
                      type='text'
                      id='address'
                      placeholder='Enter address'
                      onChange={(e) => setStakeForAddress(e.target.value)}
                      className='p-2 rounded outline-none border-2 border-[#7071E8] bg-white text-black'
                    />

                    <label htmlFor='quantity' className='font-semibold'>
                      Stake Quantity
                    </label>
                    <input
                      type='number'
                      id='quantity'
                      placeholder='Enter quantity'
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className='p-2 rounded border-2 border-[#7071E8]  bg-white text-black'
                    />

                    <button
                      onClick={handleStake}
                      className='flex justify-center items-center w-full bg-[#7071E8] p-3 rounded text-white hover:bg-[#7071E8] transition-colors'
                    >
                      {!loadingStakeTx && 'Stake'}
                      {loadingStakeTx && (
                        <ClipLoader color={'white'} size={24} />
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <label htmlFor='address' className='font-semibold'>
                      Unstake from address
                    </label>
                    <input
                      type='text'
                      id='address'
                      placeholder='Enter address'
                      onChange={(e) => setStakeForAddress(e.target.value)}
                      className='p-2 rounded border-2 border-[#7071E8]  bg-white text-black'
                    />{' '}
                    <label htmlFor='address' className='font-semibold'>
                      Unstake Quantity
                    </label>
                    <input
                      type='text'
                      id='address'
                      placeholder='Enter quantity '
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className='p-2 rounded border-2 border-[#7071E8]  bg-white text-black'
                    />
                    <button
                      onClick={handleUnstake}
                      className='flex justify-center items-center w-full text-white bg-red-500 p-3 rounded hover:bg-red-700 transition-colors'
                    >
                      {!loadingUnstakeTx && 'Unstake'}
                      {loadingUnstakeTx && (
                        <ClipLoader color={'white'} size={24} />
                      )}
                    </button>
                  </>
                )}
              </div>

              <div className='flex justify-between mt-5 mb-2'>
                <button
                  onClick={() => handleTabSwitch('Your Stakes')}
                  className={`text-center  flex-1 bg-[#7071E8]  p-2 rounded ${
                    activeTab === 'Your Stakes'
                      ? 'text-white'
                      : 'bg-white border-2 text-[#7071E8] border-[#7071E8]'
                  }`}
                >
                  Your Stakes
                </button>
                <button
                  onClick={() => handleTabSwitch('Stakes Received')}
                  className={`text-center   flex-1 bg-[#7071E8]  p-2 rounded ml-2 ${
                    activeTab === 'Stakes Received'
                      ? 'text-white'
                      : 'bg-white border-2 text-[#7071E8] border-[#7071E8] '
                  }`}
                >
                  Stakes Received
                </button>
              </div>

              <div className='overflow-y-auto max-h-[300px] mt-4 border-2 p-2 border-[#7070e86d] '>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b-2 border-[#7070e86d]  '>
                      {activeTab === 'Your Stakes' ? (
                        <>
                          <th className='pb-2 text-left  text-[#7071E8]'>
                            Address
                          </th>
                          <th className='pb-2 text-left   text-[#7071E8]'>
                            Your stake
                          </th>
                          <th className='pb-2   text-[#7071E8]'>
                            Credibility given
                          </th>
                        </>
                      ) : (
                        <>
                          <th className='pb-2  text-left text-[#7071E8]'>
                            Address
                          </th>
                          <th className='pb-2  text-left   text-[#7071E8]'>
                            Stakes <br></br>received
                          </th>
                          <th className='pb-2   text-[#7071E8]'>
                            Credibility <br></br>gained
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab === 'Your Stakes'
                      ? stakesData
                      : receivedData
                    ).map((data, index) => (
                      <tr key={index} className='border-b w-4  text-md'>
                        <td
                          className='py-2 flex items-center gap-2 text-[#7071E8]'
                          onClick={() => copyToClipboard(data.address)}
                        >
                          {formatAddress(data.address)}
                          <PiCopySimpleBold className='text-[#7071E8] cursor-pointer' />
                        </td>
                        <td className='py-2 text-center text-[#7071E8]'>
                          {activeTab === 'Your Stakes'
                            ? data.stake
                            : data.received}
                        </td>
                        <td className='py-2 text-center text-[#7071E8]'>
                          {activeTab === 'Your Stakes'
                            ? data.credibility
                            : data.credibilityGained}
                        </td>
                      </tr>
                    ))}
                    {(activeTab === 'Your Stakes'
                      ? stakesData.length
                      : receivedData.length) === 0 && (
                      <tr className='flex justify-center items-center pt-2'>
                        <td className='flex justify-center items-center'>
                          No Data
                        </td>
                      </tr>
                    )}
                    {/* <tr className='border-b w-4   text-md'>
                      <td className='py-2 flex items-center  gap-2 '>
                        0xualfkkjafkkafakljadkjf3
                        <PiCopySimpleBold className='text-[#7071E8]' />
                      </td>
                      <td className='py-2 text-center justify-center'>
                        10 $MAND
                      </td>
                      <td className='py-2 flex justify-center items-center gap-2'>
                        100
                      </td>
                    </tr>{' '}
                    <tr className='border-b w-4   text-md'>
                      <td className='py-2 flex items-center  gap-2 '>
                        0xualfkkjafkkafakljadkjf3
                        <PiCopySimpleBold className='text-[#7071E8]' />
                      </td>
                      <td className='py-2 text-center justify-center'>
                        10 $MAND
                      </td>
                      <td className='py-2 flex justify-center items-center gap-2'>
                        100
                      </td>
                    </tr>{' '}
                    <tr className='border-b w-4   text-md'>
                      <td className='py-2 flex items-center  gap-2 '>
                        0xualfkkjafkkafakljadkjf3
                        <PiCopySimpleBold className='text-[#7071E8]' />
                      </td>
                      <td className='py-2 text-center justify-center'>
                        10 $MAND
                      </td>
                      <td className='py-2 flex justify-center items-center gap-2'>
                        100
                      </td>
                    </tr>{' '}
                    <tr className='border-b w-4   text-md'>
                      <td className='py-2 flex items-center  gap-2 '>
                        0xualfkkjafkkafakljadkjf3
                        <PiCopySimpleBold className='text-[#7071E8]' />
                      </td>
                      <td className='py-2 text-center justify-center'>
                        10 $MAND
                      </td>
                      <td className='py-2 flex justify-center items-center gap-2'>
                        100
                      </td>
                    </tr>{' '} */}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='main-container-cr w-[60%] max-h-full flex flex-col gap-4 '>
              <div className='claim-rewards-container bg-credibility-staking-rewards-gradient px-4 py-2 flex flex-col  gap-4  '>
                {/* <div className='claimreward-item-container p-2 w-full flex  items-center justify-start gap-4  '>
              <div className='left-container text-xl bg-white  flex  gap-4  p-2 font-bold border-2 border-[#7071E8]'>
                You have{' '}
                <span className='text-bold text-[#7071E8]'>
                  {parseFloat(allocatedTokens).toFixed(2)}
                </span>
                $DAO to be claimed
              </div>
              <button
                className='right-container text-xl p-2 font-semibold text-white bg-[#7071E8]'
                onClick={handleClaim}
              >
                Claim
              </button>
            </div> */}

                <div className='top-data-container flex flex-col gap-2'>
                  <div className='top-container bg-black w-full flex justify-around py-4 '>
                    <div className='data-container flex-1  flex flex-col items-center  justify-center '>
                      <div className='title text-[#7071E8]'>Rank</div>
                      <div className='data-value-container text-[24px] flex gap-[4px]'>
                        <img src={RankIcon}></img>
                        <div className='text'>{userRank}</div>
                      </div>
                    </div>{' '}
                    <div className='data-container flex flex-col flex-1 items-center  justify-center border-l-[1px] border-[#7071E8]'>
                      <div className='title text-[#7071E8]'>
                        Available $MAND
                      </div>
                      <div className='data-value-container text-[24px] flex gap-[4px]'>
                        <img src={AvailableMandeIcon}></img>
                        <div className='text'>{mandBalance}</div>
                      </div>
                    </div>{' '}
                    <div className='data-container flex flex-col items-center  justify-center flex-1 border-l-[1px] border-[#7071E8] '>
                      <div className='title text-[#7071E8]'>Locked $MAND</div>
                      <div className='data-value-container text-[24px] flex gap-[4px]'>
                        <img src={LockedMand}></img>
                        <div className='text'>{stakedBalance}</div>
                      </div>
                    </div>{' '}
                  </div>
                  <div className='bottom-container flex  justify-around'>
                    <div className='data-container flex flex-col gap-2 items-center  justify-center bg-black min-w-[280px]  max-w-[30%]'>
                      <div className='title mt-2 text-[#7071E8]'>
                        Credibility staking rewards
                      </div>
                      <div className='bottom-claim-container flex justify-between items-center w-full px-4 '>
                        <div className='data-value-container text-[24px] flex gap-[4px] '>
                          <img src={LockedMand}></img>
                          <div className='text-xl'>{allocatedTokens}</div>
                        </div>
                        <button
                          className='flex justify-center items-center w-[50%] claim-btn text-lg bg-claim-btn-gradient px-2 border-[2px] border-[#7071E8]'
                          onClick={handleClaim}
                        >
                          {!loadingClaimTx && 'Claim'}
                          {loadingClaimTx && (
                            <ClipLoader color={'white'} size={24} />
                          )}
                        </button>
                      </div>
                      <div className='info-container  bg-[#7071E8] text-black flex items-center gap-2 w-full px-2'>
                        <img src={infoIcon}></img>
                        <div className='text-[10px] font-semibold text-center '>
                          Rewards are distributed every Saturday 12PM CT
                          (Central time)
                        </div>
                      </div>
                    </div>{' '}
                    <div className='data-container flex flex-col  items-center  justify-between bg-black min-w-[280px] max-w-[30%] '>
                      <div className='title mt-2 text-[#7071E8]'>
                        Your credibility score
                      </div>

                      <div className='data-value-container text-[24px] flex gap-[4px]  items-center'>
                        <img src={LockedMand}></img>
                        <div className='text-2xl '>{credScore}</div>
                      </div>
                      <div className='info-container  bg-[#7071E8] text-black flex items-center gap-2 w-full px-2'>
                        <img src={infoIcon}></img>
                        <div className='text-[10px] font-semibold text-center '>
                          To increase your credibility get more friends to stake
                          on your address
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='credibiliy-rewards-container  mb-4 bg-white  h-[50%]  text-black placeholder:p-2 p-2'>
                  <div className='heading text-2xl font-bold text-[#7071E8]'>
                    How is credibility calculated?
                  </div>
                  <div className='description'>
                    When your friend stakes 25 $MAND tokens on your address you
                    get √25 = 5 credibilty points.This is{' '}
                    <a
                      target='_blank'
                      href='https://towardsdatascience.com/what-is-quadratic-voting-4f81805d5a06'
                      className='text-[#7071E8] font-semibold underline'
                    >
                      Quadratic voting
                    </a>
                  </div>
                  <br></br>
                  <div className='description flex flex-col gap-2'>
                    Quadratic voting rewards more people supporting you over
                    tokens that are staked on you. For example if one friend
                    stakes 100 $MAND tokens on your address you get √100 = 10
                    credibilty points,But if same 100 $MAND tokens are staked by
                    4 different friends at $25 each you get 4*√25 = 20
                    credibilty points.
                    <br></br>
                    {/* <span className='text-[#7071E8]  font-semibold text-xl'>
                  To increase your credibility get more friends to support you
                </span> */}
                    {/* <div className='overflow-y-auto max-h-[300px] mt-4 border-2 p-2 border-[#7070e86d] '>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b-2 border-[#7070e86d]  '>
                        <th className='pb-2   text-[#7071E8]'>Address</th>
                        <th className='pb-2  text-left   text-[#7071E8]'>
                          Stakes <br></br>received
                        </th>
                        <th className='pb-2   text-[#7071E8]'>
                          Credibility <br></br>gained
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivedData.map((data, index) => (
                        <tr key={index} className='border-b w-4  text-md'>
                          <td
                            className='py-2 flex items-center gap-2 '
                            onClick={() => copyToClipboard(data.address)}
                          >
                            {formatAddress(data.address)}
                            <PiCopySimpleBold className='text-[#7071E8]' />
                          </td>
                          <td className='py-2 text-center'>{data.received}</td>
                          <td className='py-2 text-center'>
                            {data.credibilityGained}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {openModal && <LeaderBoardModal closeModal={closeModal} />}
      </div>
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={true}
        rtl={false}
        theme='light'
      />
    </motion.main>
  );
}

export default Dashboard;
