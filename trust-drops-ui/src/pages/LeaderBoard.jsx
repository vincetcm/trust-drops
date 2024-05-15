import React, { useState, useEffect, useContext } from 'react';
import { MdOutlineLeaderboard, MdOutlineVerifiedUser } from 'react-icons/md';
import {
  FaRegUserCircle,
  FaRegDotCircle,
  FaRegSmileWink,
} from 'react-icons/fa';
import { IoLockClosedOutline } from 'react-icons/io5';
import { TbUserUp } from 'react-icons/tb';
import { PiCopySimpleBold } from 'react-icons/pi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { createClient, cacheExchange, fetchExchange } from 'urql';
import { DataContext } from '../context/DataContext';

function LeaderBoard() {
  // Check the value of sendMessage
  // const [isModalOpen, setModalOpen] = useState(openModal);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);
  const [boardItems, setBoardItems] = useState([]);
  const [userBoardItem, setUserBoardItem] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const { accountAddress, trustdropContract } = useContext(DataContext);

  useEffect(() => {
    (async () => {
      const countQuery = `
        query {
          aggregated(id:"TRUSTDROPS") {
            usersCount
          }
        }
      `;

      const client = createClient({
        url: process.env.REACT_APP_SUBGRAPH_API,
        exchanges: [cacheExchange, fetchExchange],
      });

      const data = await client.query(countQuery).toPromise();
      console.log('subgraph count data - ', data.data.aggregated.usersCount);
      setTotalPages(
        parseInt(data.data.aggregated.usersCount / itemsPerPage) + 1
      );
    })();
  }, []);

  useEffect(() => {
    if (!accountAddress || !trustdropContract?.address) return;

    (async () => {
      let userRank = 0;
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}userRank/${accountAddress}`);
        const userRankJson = await res.json();
        userRank = userRankJson.rank;
      } catch (err) {
        console.log("could not fetch user details")
      }
      const userQuery = `
        query {
          user(id: "${accountAddress}") {
            id
            address
            tokenStaked
            credScoreAccrued
            credScoreDistributed
          }
        }
      `;
      const client = createClient({
        url: process.env.REACT_APP_SUBGRAPH_API,
        exchanges: [cacheExchange, fetchExchange],
      });
      const userData = await client.query(userQuery).toPromise();
      const userBoardData = {
        rank: userRank,
        wallet: userData.data.user.address,
        credibilityScore: userData.data.user.credScoreAccrued,
        lockedMand: userData.data.user.tokenStaked,
        credibilityGiven: userData.data.user.credScoreDistributed,
      };
      console.log('userData - ', userBoardData);
      setUserBoardItem(userBoardData);
    })();
  }, [accountAddress, trustdropContract]);

  useEffect(() => {
    (async () => {
      const usersQuery = `
        query {
          users(orderBy: credScoreAccrued, orderDirection: desc, first: ${itemsPerPage}, skip: ${
        (currentPage - 1) * itemsPerPage
      }) {
            id
            address
            tokenStaked
            credScoreAccrued
            credScoreDistributed
          }
        }
      `;

      const client = createClient({
        url: process.env.REACT_APP_SUBGRAPH_API,
        exchanges: [cacheExchange, fetchExchange],
      });

      const data = await client.query(usersQuery).toPromise();
      const leaderBoardData = data.data.users.map((el, idx) => {
        return {
          rank: idx + 1 + (currentPage - 1) * itemsPerPage,
          wallet: el.address,
          credibilityScore: el.credScoreAccrued,
          lockedMand: el.tokenStaked,
          credibilityGiven: el.credScoreDistributed,
        };
      });
      setBoardItems(leaderBoardData);
    })();
  }, [currentPage]);

  const copyToClipboard = async (wallet) => {
    try {
      await navigator.clipboard.writeText(wallet);
      toast.success('Address copied!');
      // Display some notification or change the icon if needed
    } catch (err) {
      // Handle the error case
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginationItems = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // Always add the first two and the last two pages
      if (i <= 5 || i > totalPages - 5) {
        pages.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`p-2 ${
              currentPage === i
                ? 'text-[#7071E8] bg-white'
                : 'text-gray-600 bg-white'
            }`}
          >
            {i}
          </button>
        );
      } else if (i >= currentPage - 2 && i <= currentPage + 2) {
        // Add the current page and one page on either side
        pages.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`p-2 ${
              currentPage === i
                ? 'text-[#7071E8] bg-white '
                : 'text-gray-600 bg-white'
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 5 || i === currentPage + 5) {
        // Add ellipses when skipping segment of pages
        pages.push(
          <span key={i} className='p-2 text-gray-600'>
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <motion.main
      initial={{ y: -5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className='leaderboard-container bg-black text-white flex flex-col gap-4 font-mono  w-full px-[5%]'>
        <div className='top-container flex flex-col'>
          <div className='heading-container font-bold text-[32px]'>
            Leaderboard
          </div>
          <div className='mb-5 description-container text-slate-300'>
            Build Your Credibility: Stake on Trusted Connections and Rise in
            Rank!
          </div>
          <div className='description-container text-slate-300'>
            The top 5000 addresses on the testnet leaderboard will receive the
            following Mainnet airdrops:
            <div className=' flex gap-8'>
              <ul className='list-disc ml-5'>
                <li>Top 10: 2,000 $MAND each</li>
                <li>Top 11-25: 1,500 $MAND each</li>
                <li>Top 26-100: 750 $MAND each</li>
              </ul>
              <ul className='list-disc ml-5'>
                <li>Top 100-1000: 100 $MAND each</li>
                <li>Top 1000-5000: 20 $MAND each</li>
                <li>Top 5000-10000: 10 $MAND each</li>
              </ul>
              <ul className='list-disc ml-5'>
                <li>Top 3000 by "credibility given": 10 $MAND each</li>
              </ul>
            </div>
          </div>
        </div>
        <div className='table-container w-full'>
          <div className=' overflow-y-auto h-full w-full flex  items-start '>
            <div className='w-full '>
              <div className='mt-2'>
                <div className='shadow overflow-hidden  border-8 border-[#7071E8] '>
                  <table className='w-full bg-white'>
                    <thead className='text-black bg-[#7071E8] '>
                      <tr>
                        <th className='text-left py-3 px-4 uppercase font-semibold text-sm  '>
                          <MdOutlineLeaderboard className='h-4 mr-2 w-4 inline-block ml-2' />
                          Rank
                        </th>
                        <th className='text-left py-3 px-4 uppercase font-semibold text-sm '>
                          <FaRegUserCircle className='h-4 mr-2 w-4 inline-block ml-2' />
                          Wallet address
                        </th>
                        <th className='text-left py-3 px-4 uppercase font-semibold text-sm'>
                          <MdOutlineVerifiedUser className='h-4 w-4 mr-2 inline-block ml-2' />
                          Credibility score
                        </th>
                        <th className='text-left py-3 px-4 uppercase font-semibold text-sm'>
                          <IoLockClosedOutline className='h-4 mr-2 w-4 inline-block ml-2' />
                          Locked $MAND
                        </th>
                        <th className='text-left py-3 px-4 uppercase font-semibold text-sm'>
                          <TbUserUp className='h-4 mr-2 w-4 inline-block ml-2' />
                          Credibility given
                        </th>
                      </tr>
                    </thead>
                    <tbody className='text-white text-[16px] bg-black'>
                      {(boardItems.length > 0 || userBoardItem?.wallet) &&
                        [
                          userBoardItem,
                          ...boardItems.filter(
                            (result) =>
                              result.wallet.toLowerCase() !==
                              accountAddress.toLowerCase()
                          ),
                        ]
                          .filter((result) => result !== undefined)
                          .map((item, index) => (
                            <tr key={index}>
                              <td className='text-center py-3 px-4'>
                                {item.rank}
                              </td>
                              <td
                                className={
                                  'text-left py-3  px-4 flex items-center ' +
                                  (item.wallet.toLowerCase() ==
                                  accountAddress.toLowerCase()
                                    ? 'text-[#7071E8]'
                                    : '')
                                }
                              >
                                {item.wallet}
                                <PiCopySimpleBold
                                  className='h-5 w-5 ml-2 text-[#7071E8] cursor-pointer'
                                  onClick={() => copyToClipboard(item.wallet)}
                                />
                              </td>
                              <td className=' py-3 px-4 text-center'>
                                {item.credibilityScore}
                              </td>
                              <td className='text-center py-3 px-4'>
                                {parseFloat(
                                  ethers.utils.formatUnits(item.lockedMand)
                                ).toFixed(2)}
                              </td>
                              <td className='text-center py-3 px-4'>
                                {item.credibilityGiven}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>

                <div className='flex flex-col xs:flex-row items-center xs:justify-between mt-4'>
                  <div className='flex overflow-x-auto'>
                    <button
                      className=' p-2  text-base  text-black bg-[#7071E8]  hover:bg-[#7070e8d0]'
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      &lt;&lt;
                    </button>
                    {paginationItems()}
                    <button
                      className=' p-2  text-base  text-black bg-[#7071E8]  hover:bg-[#7070e8d0]'
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      &gt;&gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

export default LeaderBoard;
