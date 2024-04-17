import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroBG from '../assets/HeroBackground.svg';
import DymentionLogo from '../assets/logo-dymension-bright.png';
const ethers = require('ethers');
function LandingPage() {
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      // Check if MetaMask is installed
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []); // Request access to wallet
        const signer = provider.getSigner();
        if (signer) {
          navigate('/verification');
        }
        console.log('Account:', await signer.getAddress());
      } catch (error) {
        console.error(error);
      }
    } else {
      // If MetaMask is not installed, prompt the user to install it
      window.alert('Please install MetaMask!');
    }
  };

  const HowItWorks = () => {
    const HIWCards = ({ sno, heading, description }) => {
      return (
        <div className=' font-mono  flex flex-col gap-2 w-full '>
          <div className='number text-5xl font-semibold text-[#7071E8] '>
            {sno}
          </div>
          <div className='heading text-2xl font-bold text-black  '>
            {heading}{' '}
          </div>
          <div className='description text-xl w-2/3'>{description}</div>
        </div>
      );
    };
    return (
      <div className='  w-full mt-8 font-mono '>
        <div className='top-container flex flex-col gap-2'>
          <div className='heading-text font-bold text-xl'>How it works ?</div>
          <div className='sub-heading-text text-lg mb-6'>
            Get started with 3 easy steps{' '}
          </div>
        </div>
        <div className='bottom-container flex justify-center gap-16 w-full'>
          <HIWCards
            sno={1}
            heading={'Connect and Verify'}
            description={
              "Receive $DAO tokens by proving your adhaar card's validity, while keeping your sensitive data private. Anon-Adhaar uses zero-knowledge circuits to generate proof."
            }
          />
          <HIWCards
            sno={2}
            heading={'Stake and cast your vote.'}
            description={`Stake your $DAO tokens and use them to vote for your friends for them to receive airdrops. Your votes help shape the community's trust network while enhancing your friends credibility score.`}
          />
          <HIWCards
            sno={3}
            heading={'Get rewarded as your credibility score climbs'}
            description={
              'Collect votes from your friends to boost your credibility score and earn more rewards. Increase your credibility and enjoy monthly rewards and exclusive airdrops.'
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className=' flex  justify-center  h-[90%]  bg-black   text-white font-mono'>
      <div className='left-container w-[60%] pl-[5%] flex flex-col justify-between  '>
        <div className='text-container flex flex-col gap-2 flex-1 justify-center'>
          <div className='hero-title font-semibold text-[36px] '>
            Credibility is the currency of trust, invaluable yet hard-earned.
          </div>
          <div className='hero-description  text-[20px] text-slate-400'>
            Experience the value of trust in every interaction. At Mande
            Network, credibility is the cornerstone of our decentralized
            ecosystem, empowering users to forge genuine connections and drive
            meaningful change.
          </div>
          <div className='button flex '>
            <Link
              to={'/airdrop'}
              className={`button  text-[#7071E8] text-[28px] font-semibold bg-hero-button border-[1px] px-2 border-[rgb(112,113,232)] mt-8 flex justify-start  cursor-pointer shadow-[#7071E8] shadow-md hover:shadow-[5px_5px_rgba(112,_113,_232,_0.4),_10px_10px_rgba(112,_113,_232,_0.3),_15px_15px_rgba(0,0,0,_0.0),_20px_20px_rgba(0,0,0,_0.0),_25px_25px_rgba(112,_113,_232,_0.05)]  `}
            >
              Earn $MAND
            </Link>
          </div>
        </div>
        <div className='button-container flex  gap-2 mb-8'>
          <div className='text-[#7071E8]'>Powered by </div>
          <img src={DymentionLogo} className='w-36  '></img>
        </div>
      </div>
      <div className='right-container  w-[40%]  h-full '>
        <img src={HeroBG} className='object-cover h-full'></img>
      </div>
    </div>
  );
}

export default LandingPage;
