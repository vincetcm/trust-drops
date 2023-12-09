import React, { useState } from 'react';
import LeaderBoardModal from '../components/LeaderBoardModal';
import Navbar from '../components/Navbar';
import { PiCopySimpleBold } from 'react-icons/pi';
import { MdOutlineLeaderboard, MdOutlineVerifiedUser } from 'react-icons/md';
import { FaRegUserCircle, FaRegDotCircle } from 'react-icons/fa';
import { IoLockClosedOutline } from 'react-icons/io5';
import { TbUserUp } from 'react-icons/tb';
function Dashboard() {
  const [openModal, setOpenModal] = useState(false);

  const [isStaking, setIsStaking] = useState(true);
  const [activeTab, setActiveTab] = useState('Your Stakes');
  const stakesData = [
    {
      address: '0xadfe20xadfe20xadfe20xadfe20xadfe20xadfe20xadfe20xadfe2',
      stake: '100.00 $DAO',
      credibility: '10.00',
    },
    {
      address: '0xadfe20xadfe20xadfe20xadfe20xadfe20xadfe20xadfe20xadfe2',
      stake: '400.00 $DAO',
      credibility: '40.00',
    },
    { address: '0xadfe2...f15d2', stake: '140.00 $DAO', credibility: '50.00' },
    { address: '0xadfe2...f135d', stake: '130.00 $DAO', credibility: '11.00' },
  ];

  const receivedData = [
    {
      address: '0xadfe2...f15d4',
      received: '120.00 $DAO',
      credibilityGained: '15.00',
    },
  ];
  const formatAddress = (address) => {
    const maxLength = 14;
    return address.length > maxLength
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      : address;
  };

  const copyToClipboard = async (wallet) => {
    try {
      await navigator.clipboard.writeText(wallet);
    } catch (err) {
      // Handle the error case
    }
  };

  const handleStake = () => {
    console.log('Stake function executed');
  };

  const handleUnstake = () => {
    console.log('Unstake function executed');
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
  return (
    <div className='  flex flex-col justify-center w-full md:w-screen font-mono'>
      <div className='flex flex-col items-center justify-between'>
        <div className='dashboard-container  w-full md:w-[90%] p-4 md:p-8 bg-[rgba(112,113,232,0.03)]'>
          <div className='top-container flex items-center gap-8 justify-evenly '>
            <div className='address flex gap-2 items-center'>
              <div className='icon'>
                <FaRegUserCircle className='text-xl font-bold text-[#7071E8]' />
              </div>
              <div className='text-lg'>0xfadsfe2...d154</div>
            </div>{' '}
            <div className='available-mand'>
              <div className='top-container flex items-center gap-2'>
                <div className='icon'>
                  <FaRegDotCircle className='text-xl font-bold text-[#7071E8]' />
                </div>
                <div className='text-xl text-[#7071E8] font-bold'>
                  Available $DAO
                </div>
              </div>{' '}
              <div className='bottom-container text-3xl font-bold text-center'>
                3133.50
              </div>
            </div>{' '}
            <div className='available-mand'>
              <div className='top-container flex items-center gap-2'>
                <div className='icon'>
                  <IoLockClosedOutline className='text-xl font-bold text-[#7071E8]' />
                </div>
                <div className='text-xl text-[#7071E8] font-bold'>
                  Locked $DAO
                </div>
              </div>{' '}
              <div className='bottom-container text-3xl font-bold  text-center'>
                320
              </div>
            </div>{' '}
            <div className='available-mand'>
              <div className='top-container flex items-center gap-2'>
                <div className='icon'>
                  <MdOutlineVerifiedUser className='text-xl font-bold text-[#7071E8]' />
                </div>
                <div className='text text-xl text-[#7071E8] font-bold'>
                  Credibility score
                </div>
              </div>{' '}
              <div className='bottom-container text-3xl font-bold  text-center'>
                100.50
              </div>
            </div>{' '}
            <div className='available-mand ' onClick={openLeaderBoard}>
              <div className='top-container flex items-center gap-2'>
                <div className='icon'>
                  <MdOutlineLeaderboard className='text-xl font-bold text-[#7071E8]' />
                </div>
                <div className=' text-xl text-[#7071E8] font-bold'>
                  Your rank
                </div>
              </div>{' '}
              <div className='bottom-container underline text-3xl font-bold  text-center'>
                # 1
              </div>
            </div>
          </div>
        </div>
        <div className='main-container  flex flex-col md:flex-row justify-between mt-4 w-[90%]'>
          <div className='credibility-staking-container  bg-[rgba(112,113,232,0.03)] p-4 md:p-5 rounded-lg shadow-md max-w-full md:max-w-md mb-4 md:mb-0 '>
            <h1 className='text-2xl font-bold mb-4 text-[#7071E8]'>
              Credibility Staking
            </h1>
            <p className='text-sm mb-4'>
              Boost your credibility and earn more rewards! Ask friends to stake
              their $DAO tokens on your address. The more support you get, the
              better your score. Use this interface below to vote for friends
              and help them earn more too!
            </p>

            <div className='flex justify-between mb-4'>
              <button
                onClick={() => setIsStaking(true)}
                className={`flex-1 p-2 rounded ${
                  isStaking
                    ? 'bg-[#7071E8] text-white'
                    : 'bg-white border-2 text-[#7071E8] border-[#7071E8]'
                }`}
              >
                Stake
              </button>
              <button
                onClick={() => setIsStaking(false)}
                className={`flex-1 p-2 rounded ml-2 ${
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
                    className='p-2 rounded outline-none border-2 border-[#7071E8] bg-white text-black'
                  />

                  <label htmlFor='quantity' className='font-semibold'>
                    Stake Quantity
                  </label>
                  <input
                    type='number'
                    id='quantity'
                    placeholder='Enter quantity'
                    className='p-2 rounded border-2 border-[#7071E8]  bg-white text-black'
                  />

                  <button
                    onClick={handleStake}
                    className='w-full bg-[#7071E8] p-3 rounded text-white hover:bg-[#7071E8] transition-colors'
                  >
                    Stake
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
                    className='p-2 rounded border-2 border-[#7071E8]  bg-white text-black'
                  />{' '}
                  <label htmlFor='address' className='font-semibold'>
                    Unstake Quantity
                  </label>
                  <input
                    type='text'
                    id='address'
                    placeholder='Enter quantity '
                    className='p-2 rounded border-2 border-[#7071E8]  bg-white text-black'
                  />
                  <button
                    onClick={handleUnstake}
                    className='w-full text-white bg-red-500 p-3 rounded hover:bg-red-700 transition-colors'
                  >
                    Unstake
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
                    : 'bg-white border-2 text-[#7071E8] border-[#7071E8] '
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

            <div className='overflow-x-auto mt-4 border-2 p-2 border-[#7070e86d] '>
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
                        <th className='pb-2   text-[#7071E8]'>Address</th>
                        <th className='pb-2   text-[#7071E8]'>
                          Stakes received
                        </th>
                        <th className='pb-2   text-[#7071E8]'>
                          Credibility gained
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
                    <tr key={index} className='border-b w-4 text-md'>
                      <td
                        className='py-2 flex items-center gap-2 '
                        onClick={() => copyToClipboard(data.address)}
                      >
                        {formatAddress(data.address)}
                        <PiCopySimpleBold className='text-[#7071E8]' />
                      </td>
                      <td className='py-2'>
                        {activeTab === 'Your Stakes'
                          ? data.stake
                          : data.received}
                      </td>
                      <td className='py-2 text-center'>
                        {activeTab === 'Your Stakes'
                          ? data.credibility
                          : data.credibilityGained}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className='claim-rewards-container w-full md:w-3/5 bg-[rgba(112,113,232,0.03)] p-4 '>
            <div className='credibiliy-rewards-container  mb-4'>
              <div className='heading text-2xl font-bold text-[#7071E8]'>
                Credibilty Rewards
              </div>
              <div className='description'>claim your credibility rewards</div>
            </div>
            <div className='claimreward-item-container p-2 w-1/2 flex  items-center justify-between '>
              <div className='left-container text-xl flex self-center gap-2 border-2 border-[#7071E8] p-2 font-bold'>
                claim your <span className='text-bold text-[#7071E8]'>100</span>
                $DAO
              </div>
              <button className='right-container text-xl p-2 font-semibold text-white bg-[#7071E8]'>
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
      {openModal && <LeaderBoardModal closeModal={closeModal} />}
    </div>
  );
}

export default Dashboard;
