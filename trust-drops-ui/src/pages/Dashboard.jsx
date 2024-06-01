import React, { useState, useEffect } from 'react';
import { PiCopySimpleBold } from 'react-icons/pi';
import { ethers } from 'ethers';
import { createClient, cacheExchange, fetchExchange } from 'urql';
import ClipLoader from 'react-spinners/ClipLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import RankIcon from '../assets/rankIcon.svg';
import AvailableMandeIcon from '../assets/availableMandIcon.svg';
import LockedMand from '../assets/lockedMandIcon.svg';
import infoIcon from '../assets/infoIcon.svg';
import { motion } from 'framer-motion';
import { gql } from '@urql/core';
import { useAccount, useWriteContract, useReadContracts, useBalance } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query' 
import trustdropABI from '../abis/trustdropABI.json';

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
  const [isStaking, setIsStaking] = useState(true);

  const [userStakesData, setUserStakesData] = useState({});
  const [userRank, setUserRank] = useState(0);

  const [stakeForAddress, setStakeForAddress] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');

  const [loadingStakeTx, setLoadingStakeTx] = useState(false);
  const [loadingUnstakeTx, setLoadingUnstakeTx] = useState(false);
  const [loadingClaimTx, setLoadingClaimTx] = useState(false);
  const account = useAccount();
  const queryClient = useQueryClient();

  const { 
    data
  } = useReadContracts({ 
    contracts: [{ 
      abi: trustdropABI.abi,
      address: process.env.REACT_APP_TRUSRDROPS_CONTRACT_ADDRESS,
      functionName: 'totalStakedByUser',
      args: [account.address],
    }, { 
      abi: trustdropABI.abi,
      address: process.env.REACT_APP_TRUSRDROPS_CONTRACT_ADDRESS,
      functionName: 'reputation',
      args: [account.address],
    }, { 
      abi: trustdropABI.abi,
      address: process.env.REACT_APP_REWARD_DISTRIBUTOR_CONTRACT_ADDRESS,
      functionName: 'allocation',
      args: [account.address],
    }, { 
      abi: trustdropABI.abi,
      address: process.env.REACT_APP_TRUSRDROPS_CONTRACT_ADDRESS,
      functionName: 'weeklyYield',
      args: [],
    }],
    refetchInterval: 10000,
    refetchIntervalInBackground: true
  }) 
  const [stakedBalance, credScore, allocatedTokens, weeklyYield] = data || [];
  const { data: mandBalance, queryKey: balanceQueryKey } = useBalance({
    address: account?.address,
  });

  const { 
    data: stakeTxHash,
    error: stakeTxError, 
    writeContract: writeStakeTx
  } = useWriteContract();

  const { 
    data: unstakeTxHash,
    error: unstakeTxError, 
    writeContract: writeUnstakeTx
  } = useWriteContract();

  const { 
    data: claimTxHash,
    error: claimTxError, 
    writeContract: writeClaimTx
  } = useWriteContract();

  useEffect(() => {
    if (stakeTxHash) {
      toast.success('Stake successfull');
      setLoadingStakeTx(false);
      queryClient.invalidateQueries({ balanceQueryKey });
    }

    if (stakeTxError) {
      toast.error(stakeTxError);
      setLoadingStakeTx(false);
    }
  }, [stakeTxHash, stakeTxError]);

  useEffect(() => {
    if (unstakeTxHash) {
      toast.success('Unstake successfull');
      setLoadingUnstakeTx(false);
      queryClient.invalidateQueries({ balanceQueryKey });
    }

    if (unstakeTxError) {
      toast.error(unstakeTxError);
      setLoadingUnstakeTx(false);
    }
  }, [unstakeTxHash, unstakeTxError]);

  useEffect(() => {
    if (claimTxHash) {
      toast.success('Claim successfull');
      setLoadingClaimTx(false);
      queryClient.invalidateQueries({ balanceQueryKey });
    }

    if (claimTxError) {
      toast.error("Claim failed");
      setLoadingClaimTx(false);
    }
  }, [claimTxHash, claimTxError]);

  const formatAddress = (address) => {
    const maxLength = 18;
    return address.length > maxLength
      ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
      : address;
  };
  const truncateAmount = (amount, precision=4, decimals=18) => {
    const formattedAmount = ethers.utils.formatUnits(amount, decimals);
    let [whole, decimal] = formattedAmount.split('.');
    // toFixed will add imprecision to the number in some cases (parseFloat("1.9999").toFixed(18)),
    // so we manually pad the number
    while (decimal && decimal.length < precision) {
      decimal += '0';
    }
    decimal = decimal.substring(0, precision);

    return precision != 0 ? `${whole}.${decimal}` : whole;
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
    if (!account?.address) {
      toast.error('Please connect wallet');
      return;
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
    writeStakeTx({
      address: process.env.REACT_APP_TRUSRDROPS_CONTRACT_ADDRESS,
      abi: trustdropABI.abi,
      functionName: 'stake',
      args: [stakeForAddress],
      value: ethers.utils.parseUnits(stakeAmount)
    })
  };

  const handleUnstake = async () => {
    if (!account?.address) {
      toast.error('Please connect wallet');
      return;
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
    writeUnstakeTx({
      address: process.env.REACT_APP_TRUSRDROPS_CONTRACT_ADDRESS,
      abi: trustdropABI.abi,
      functionName: 'unstake',
      args: [stakeForAddress, ethers.utils.parseUnits(stakeAmount)],
    });
  };

  const handleClaim = async () => {
    if (!account?.address) {
      toast.error('Please connect wallet');
      return;
    }
    if (allocatedTokens?.result == 0) {
      toast.error('No rewards to claim');
      return;
    }
    setLoadingClaimTx(true);
    writeClaimTx({
      address: process.env.REACT_APP_REWARD_DISTRIBUTOR_CONTRACT_ADDRESS,
      abi: trustdropABI.abi,
      functionName: 'claimTokens',
    });
  };

  async function loadUserData() {
    try {
      fetch(`${process.env.REACT_APP_API_URL}userRank/${account.address}`)
        .then((response) => response.json())
        .then((data) => setUserRank(data.rank))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log('could not fetch user details');
    }

    let stakesData, receivedData;
    try {
      const stakesSentQuery = gql`
        query GetStakesSent($address: String!) {
          stakes(first:1000, where: { staker_: { id: $address } }) {
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
        .query(stakesSentQuery, { address: account.address })
        .toPromise();
      stakesData = data.data.stakes.toReversed().map((data) => {
        return {
          address: data.candidate.id,
          stake: truncateAmount(data.amount, 2),
          credibility: data.credScore,
        };
      });
    } catch (err) {
      console.log('check err stakesData -  ', err);
    }

    try {
      const stakesSentQuery = gql`
        query GetStakesSent($address: String!) {
          stakes(first:1000, where: { candidate_: { id: $address } }) {
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
        .query(stakesSentQuery, { address: account.address })
        .toPromise();
      receivedData = data.data.stakes.toReversed().map((data) => {
        return {
          address: data.staker.id,
          received: truncateAmount(data.amount, 2),
          credibilityGained: data.credScore,
        };
      });
    } catch (err) {
      console.log('check err receivedData -  ', err);
    }

    let finalStakesData = {};
    (stakesData || []).concat((receivedData || [])).map(el => {
      if (!finalStakesData[el.address]) finalStakesData[el.address] = {address: el.address};
      
      if (el.credibility) {
        finalStakesData[el.address].stake = el.stake;
        finalStakesData[el.address].credibility = ethers.utils.formatUnits(el.credibility, 2);
      } 
      if (el.credibilityGained) {
        finalStakesData[el.address].received = el.received;
        finalStakesData[el.address].credibilityGained = ethers.utils.formatUnits(el.credibilityGained, 2);
      }
    });
    
    console.log("finalStakesData - ", finalStakesData)

    setUserStakesData(finalStakesData);
  }

  useEffect(() => {
    if (account?.address) {
      loadUserData();
    }
  }, [account?.address]);

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
            <div className='credibility-staking-container  bg-[rgba(112,113,232,0.03)] border-2  border-[#7071E8] p-4 md:p-5 shadow-md md:w-[40%] mb-4 md:mb-0 '>
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
            </div>
            <div className='main-container-cr md:w-[60%] max-h-full flex flex-col gap-4 '>
              <div className='claim-rewards-container bg-credibility-staking-rewards-gradient px-4 py-2 flex flex-col  gap-4 h-full'>
                <div className='top-data-container flex flex-col gap-2'>
                  <div className='top-container bg-black w-full flex max-md:flex-col justify-around py-4 '>
                    <div className='data-container flex-1  flex flex-col items-center  justify-center max-md:pb-5'>
                      <div className='title text-[#7071E8]'>Rank</div>
                      <div className='data-value-container text-[24px] flex gap-[4px]'>
                        <img src={RankIcon}></img>
                        <div className='text'>{userRank}</div>
                      </div>
                    </div>{' '}
                    <div className='data-container flex flex-col flex-1 items-center  justify-center max-md:pb-5 md:border-l-[1px] md:border-[#7071E8]'>
                      <div className='title text-[#7071E8]'>
                        Available $MAND
                      </div>
                      <div className='data-value-container text-[24px] flex gap-[4px]'>
                        <img src={AvailableMandeIcon}></img>
                        <div className='text'>{mandBalance?.value ? truncateAmount(mandBalance.value) : 0}</div>
                      </div>
                    </div>{' '}
                    <div className='data-container flex flex-col items-center  justify-center flex-1 md:border-l-[1px] md:border-[#7071E8] '>
                      <div className='title text-[#7071E8]'>Locked $MAND</div>
                      <div className='data-value-container text-[24px] flex gap-[4px]'>
                        <img src={LockedMand}></img>
                        <div className='text'>{stakedBalance?.result ? truncateAmount(stakedBalance.result) : 0}</div>
                      </div>
                    </div>{' '}
                  </div>
                  <div className='bottom-container flex max-md:flex-col justify-around'>
                    <div className='data-container flex flex-col gap-2 items-center  justify-center bg-black w-[30%] max-md:w-[100%]'>
                      <div className='title mt-2 text-[#7071E8]'>
                        Credibility staking rewards
                      </div>
                      <div className='bottom-claim-container flex justify-between items-center w-full px-4 '>
                        <div className='data-value-container text-[24px] flex gap-[4px] '>
                          <div className='text-xl'>{allocatedTokens?.result ? truncateAmount(allocatedTokens.result) : 0}</div>
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
                          Rewards are distributed daily 6AM CT
                          (Central time)
                        </div>
                      </div>
                    </div>{' '}
                    <div className='data-container flex flex-col  items-center  justify-between bg-black w-[30%] max-md:mt-2 max-md:w-[100%]'>
                      <div className='title mt-2 text-[#7071E8]'>
                        Your credibility score
                      </div>

                      <div className='data-value-container text-[24px] flex gap-[4px]  items-center'>
                        <div className='text-2xl '>{credScore?.result ? ethers.utils.formatUnits(credScore.result, 2) : 0} CRED</div>
                      </div>
                      <div className='info-container  bg-[#7071E8] text-black flex items-center gap-2 w-full px-2'>
                        <img src={infoIcon}></img>
                        <div className='text-[10px] font-semibold text-center '>
                          To increase your credibility get more friends to stake
                          on your address
                        </div>
                      </div>
                    </div>
                    <div className='data-container flex flex-col  items-center  justify-between bg-black w-[30%] max-md:mt-2 max-md:w-[100%]'>
                      <div className='title mt-2 text-[#7071E8]'>
                        Daily yield
                      </div>

                      <div className='data-value-container text-[24px] flex gap-[4px]  items-center'>
                        <div className='text-2xl '>{weeklyYield?.result ? truncateAmount(weeklyYield.result, 0, 14) : 0}% of CRED</div>
                      </div>
                      <div className='info-container  bg-[#7071E8] text-black flex items-center gap-2 w-full px-2'>
                        <img src={infoIcon}></img>
                        <div className='text-[10px] font-semibold text-center '>
                          You might get upto {
                            ((weeklyYield?.result ? truncateAmount(weeklyYield.result, 0, 14) : 0)*(credScore?.result ? ethers.utils.formatUnits(credScore.result, 2) : 0))/100
                          } MAND by tomorrow
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='credibiliy-rewards-container  mb-4 bg-white  h-[60%]  text-black placeholder:p-2 p-2'>
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
                    4 different friends at 25 $MAND each you get 4*√25 = 20
                    credibilty points.
                    <br></br>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='overflow-y-auto w-[90%] mt-4 border-2 p-2 border-[#7070e86d] '>
                <table className='w-full text-sm table-auto overflow-x-auto'>
                  <thead>
                    <tr className='border-b-2 border-[#7070e86d]  '>
                      <th className='pb-2 text-left text-[#7071E8]'>
                        Address
                      </th>
                      <th className='pb-2 text-center text-[#7071E8]'>
                        Your stake
                      </th>
                      <th className='pb-2 text-center text-[#7071E8]'>
                        Credibility given
                      </th>
                      <th className='pb-2 text-center text-[#7071E8]'>
                        Stakes received
                      </th>
                      <th className='pb-2 text-center text-[#7071E8]'>
                        Credibility gained
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log("userStakesData - ", userStakesData)}
                    {Object.keys(userStakesData).map((data, index) => (
                      <tr key={index} className='border-b w-4  text-md'>
                        <td
                          className='py-2 flex items-center gap-2 text-[#7071E8]'
                          onClick={() => copyToClipboard(data)}
                        >
                          {formatAddress(data)}
                          <PiCopySimpleBold className='text-[#7071E8] cursor-pointer' />
                        </td>
                        <td className='py-2 text-center text-[#7071E8]'>
                            {userStakesData[data].stake}
                        </td>
                        <td className='py-2 text-center text-[#7071E8]'>
                            {userStakesData[data].credibility}
                        </td>
                        <td className='py-2 text-center text-[#7071E8]'>
                            {userStakesData[data].received}
                        </td>
                        <td className='py-2 text-center text-[#7071E8]'>
                            {userStakesData[data].credibilityGained}
                        </td>
                      </tr>
                    ))}
                    {Object.keys(userStakesData).length === 0 && (
                      <tr className='flex justify-center items-center pt-2'>
                        <td className='flex justify-center items-center'>
                          No Data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
        </div>
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
