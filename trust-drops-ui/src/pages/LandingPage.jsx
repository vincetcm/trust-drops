import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className=' flex  justify-center max-h-full min-h-screen  bg-gradient-to-t from-[#7071E8]  '>
      <div className='landing-container flex-1  gap-10  flex flex-col items-center  max-w-[90%]'>
        <div className='hero-section  flex flex-col items-center gap-4 pt-6 '>
          <div className='heading font-mono leading-relaxed  text-6xl text-black text-center'>
            Participate in{' '}
            <span className=' font-semibold text-[#7071E8]'>$DAO</span>
            <br></br> airdrops.
          </div>
          <button
            className='cta px-4 py-2 text-xl mt-4  max-w-[180px]    text-center  bg-[#7071E8] text-white font-semibold'
            onClick={connectWallet}
          >
            Connect wallet
          </button>
        </div>
        <HowItWorks />
      </div>
    </div>
  );
}

export default LandingPage;
