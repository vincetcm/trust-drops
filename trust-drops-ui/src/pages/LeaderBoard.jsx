import React, { useState } from 'react';
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

function LeaderBoard() {
  // Check the value of sendMessage
  // const [isModalOpen, setModalOpen] = useState(openModal);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Example dummy data
  const dummyData = Array.from({ length: 50 }, (_, index) => ({
    rank: `#${index + 1}`,
    wallet: `0xdummyWalletAddress_${index}`,
    credibilityScore: Math.round(Math.random() * 1000),
    availableSMND: Math.round(Math.random() * 100),
    lockedSMND: Math.round(Math.random() * 100),
    credibilityGiven: Math.round(Math.random() * 100),
  }));

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = dummyData.slice(firstItemIndex, lastItemIndex);

  const totalPages = Math.ceil(dummyData.length / itemsPerPage);

  const copyToClipboard = async (wallet) => {
    try {
      await navigator.clipboard.writeText(wallet);
      // Display some notification or change the icon if needed
    } catch (err) {
      // Handle the error case
    }
  };

  const showToastMessage = (winkedAt) => {
    toast.success(`You just winked at ${winkedAt}`, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <motion.main
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className='leaderboard-container bg-black text-white flex flex-col gap-4 font-mono  w-full px-[5%] h-[90vh]'>
        <div className='top-container flex flex-col'>
          <div className='heading-container font-bold text-[32px]'>
            Leaderboard
          </div>
          <div className='description-container text-slate-300'>
            Build Your Credibility: Stake on Trusted Connections and Rise in
            Rank!
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
                        <th className='text-left py-3 px-4 uppercase font-semibold text-sm '>
                          <FaRegDotCircle className='h-4 w-4 mr-2 inline-block ml-2' />
                          Available $MAND
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
                      {currentItems.map((item, index) => (
                        <tr key={index}>
                          <td className='text-center py-3 px-4'>{item.rank}</td>
                          <td className='text-left py-3  px-4 flex items-center'>
                            {item.wallet}
                            <PiCopySimpleBold
                              className='h-5 w-5 ml-2 text-[#7071E8] cursor-pointer'
                              onClick={() => copyToClipboard(item.wallet)}
                            />
                            {/* <FaRegSmileWink
                            title='wink this user to request stake'
                            className='text-center cursor-pointer text-[#7071E8] hover:bg-[#7071E8] rounded-full hover:text-white hover:scale-105 hover:border-2 hover:border-[#7071E8]'
                            // onClick={() => {
                            //   sendMessage('winked', item.wallet, '0');
                            //   showToastMessage(item.wallet);
                            // }}
                          /> */}
                            <ToastContainer />
                          </td>
                          <td className=' py-3 px-4 text-center'>
                            {item.credibilityScore}
                          </td>
                          <td className='text-center py-3 px-4'>
                            {item.availableSMND}
                          </td>
                          <td className='text-center py-3 px-4'>
                            {item.lockedSMND}
                          </td>
                          <td className='text-center py-3 px-4'>
                            {item.credibilityGiven}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className='flex flex-col xs:flex-row items-center xs:justify-between mt-4  '>
                  <div className='flex items-center'>
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className='w-full p-2  text-base  text-black bg-[#7071E8]  hover:bg-[#7070e8d0] '
                    >
                      <span className=''>&lt;&lt;</span>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`w-full p-2 border-r text-base  hover:bg-gray-100 text-gray-600 bg-white ${
                          currentPage === i + 1
                            ? 'text-blue-600 bg-blue-100'
                            : ''
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className='w-full p-2  text-base  text-black bg-[#7071E8]  hover:bg-[#7070e8d0]'
                    >
                      <span className=''>&gt;&gt;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

export default LeaderBoard;
